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
const zoro_1 = __importDefault(require("@consumet/extensions/dist/providers/anime/zoro"));
const extensions_1 = require("@consumet/extensions");
const zoro = new zoro_1.default();
const routes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get("/", (_, reply) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return reply.status(200).send({
                description: `Welcome to ${zoro.name}.`,
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
        const { page = 1 } = request.query;
        if (!query) {
            return reply
                .status(400)
                .send({ message: "Query parameter is required." });
        }
        try {
            const result = yield zoro.search(query);
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
            const result = yield zoro.fetchAnimeInfo(id);
            return reply.status(200).send(result);
        }
        catch (err) {
            console.error("Error in fetchAnimeInfo:", err);
            return reply.status(500).send({ message: "Internal server error" });
        }
    }));
    fastify.get("/episode/:episodeId", (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const { episodeId } = request.params;
        try {
            const result = yield zoro.fetchEpisodeSources(episodeId);
            return reply.status(200).send(result);
        }
        catch (err) {
            try {
                const fallbackResult = yield zoro.fetchEpisodeSources(episodeId, extensions_1.StreamingServers.VidStreaming);
                return reply.status(200).send(fallbackResult);
            }
            catch (fallbackErr) {
                return reply.status(500).send({ message: "Internal server error" });
            }
        }
    }));
});
exports.default = routes;
