"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("@fastify/cors"));
const fastify_1 = __importDefault(require("fastify"));
const chalk_1 = __importDefault(require("chalk"));
const animeunity_1 = __importDefault(require("./routes/providers/animeunity"));
const anix_1 = __importDefault(require("./routes/providers/anix"));
const gogoanime_1 = __importDefault(require("./routes/providers/gogoanime"));
const zoro_1 = __importDefault(require("./routes/providers/zoro"));
const analytics_1 = require("@vercel/analytics");
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const fastify = (0, fastify_1.default)({
    maxParamLength: 1000,
    bodyLimit: 1048576,
    logger: true,
});
const PORT = Number(process.env.PORT) || 5125;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield fastify.register(cors_1.default, {
        origin: "*",
        methods: "GET",
    });
    // rate limiting
    yield fastify.register(rate_limit_1.default, {
        global: true,
        max: 30,
        timeWindow: "1 minute",
        cache: 10000,
    });
    // rate limit 404 page
    fastify.setNotFoundHandler({
        preHandler: fastify.rateLimit({
            max: 4,
            timeWindow: 500,
        }),
    }, function (_, reply) {
        reply.code(404).send({ error: "Page Not Found" });
    });
    // api-key protection in production
    fastify.addHook("preHandler", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        if (process.env.NODE_ENV === "development")
            return;
        const apiKey = request.headers["x-api-key"];
        if (!apiKey) {
            return reply.status(400).send({ message: "API Key is required" });
        }
        if (apiKey !== process.env.API_KEY) {
            return reply.status(403).send({ message: "Forbidden: Invalid API Key" });
        }
    }));
    // regiser providers
    yield fastify.register(animeunity_1.default, { prefix: "/animeunity" });
    yield fastify.register(anix_1.default, { prefix: "/anix" });
    yield fastify.register(gogoanime_1.default, { prefix: "/gogoanime" });
    yield fastify.register(zoro_1.default, { prefix: "/zoro" });
    // proxy
    fastify.get("/proxy", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { url } = request.query;
        if (!url) {
            return reply.status(400).send({ error: 'Missing "url" query parameter' });
        }
        try {
            const response = yield fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": request.headers["user-agent"] || "Mozilla/5.0",
                    Cookie: request.headers["cookie"] || "",
                    Accept: request.headers["accept"] || "*/*",
                },
            });
            if (!response.ok) {
                return reply.status(response.status).send({
                    error: `Failed to fetch resource. Status: ${response.status}`,
                });
            }
            const data = yield response.text();
            reply
                .status(response.status)
                .headers(Object.fromEntries(response.headers.entries()))
                .send(data);
        }
        catch (error) {
            reply
                .status(500)
                .send({ error: "Proxy Error", details: error.message });
        }
    }));
    fastify.get("/", (_, reply) => {
        reply
            .status(200)
            .send("Welcome to 🛋️ sofamaxxing!\n/providers to see the available providers");
    });
    fastify.get("/providers", (_, reply) => {
        reply.status(200).send({
            providers: ["/animeunity", "/anix", "/gogoanime", "/zoro"],
        });
    });
    fastify.get("*", (_, reply) => {
        reply.status(404).send({
            message: "",
            error: "Page Not Found",
        });
    });
    if (process.env.NODE_ENV === "development") {
        try {
            yield fastify.listen({ port: PORT, host: "0.0.0.0" });
            console.log(chalk_1.default.green(`Server listening on http://localhost:${PORT}`));
        }
        catch (err) {
            fastify.log.error(err);
            process.exit(1);
        }
    }
}))();
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, analytics_1.inject)();
    yield fastify.ready();
    fastify.server.emit("request", req, res);
});
