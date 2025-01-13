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
const anix_1 = __importDefault(require("@consumet/extensions/dist/providers/anime/anix"));
const anix = new anix_1.default();
const routes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", (_, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return reply.status(200).send({
                description: `Welcome to ${anix.name}.`,
                routes: ["/:query", "/info/:id", "/episode/:episodeId"],
            });
        }
        catch (err) {
            console.error("Error in /anix route:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/:query", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = request.params;
        if (!query) {
            return reply
                .status(400)
                .send({ message: "Query parameter is required." });
        }
        try {
            const result = yield anix.search(query);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in search:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/info/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = request.params;
        const { page = 1 } = request.query;
        try {
            const result = yield anix.fetchAnimeInfo(id);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in fetchAnimeInfo:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/episode/*", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const episodeId = request.params["*"];
        try {
            const result = yield anix.fetchEpisodeSources(episodeId.split("/")[0], episodeId.split("/")[1]);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in fetchSources:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
});
exports.default = routes;
