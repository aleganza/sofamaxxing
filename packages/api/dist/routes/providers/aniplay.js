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
Object.defineProperty(exports, "__esModule", { value: true });
const dist_1 = require("sofamaxxing/dist");
const aniplay = new dist_1.AniPlay();
const routes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", (_, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return reply.status(200).send({
                description: `Welcome to ${aniplay.name}.`,
                routes: ["/:query", "/info/:id", "/episode/:episodeId"],
            });
        }
        catch (err) {
            console.error("Error in /aniplay route:", err);
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
            const result = yield aniplay.search(query);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in search:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/info/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = request.params;
        try {
            const result = yield aniplay.fetchInfo(id);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in fetchInfo:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/episode/:id", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const fullUrl = request.url;
        const episodeId = fullUrl.split("/episode/")[1].split("&")[0];
        const { host = "yuki" } = request.query;
        const { type = "sub" } = request.params;
        const validHosts = ["maze", "pahe", "yuki"];
        if (!validHosts.includes(host)) {
            return reply.status(400).send({
                message: `Invalid host value. Valid values are: ${validHosts.join(", ")}`,
            });
        }
        const validTypes = ["sub", "dub"];
        if (!validTypes.includes(type)) {
            return reply.status(400).send({
                message: `Invalid type value. Valid values are: ${validTypes.join(", ")}`,
            });
        }
        try {
            const result = yield aniplay.fetchSources(episodeId, host, type);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in fetchSources:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
});
exports.default = routes;
