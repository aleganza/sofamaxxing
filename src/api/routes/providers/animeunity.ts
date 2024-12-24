import { FastifyInstance } from "fastify";

import AnimeUnity from "../../../providers/AnimeUnity";

const animeUnity = new AnimeUnity();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        name: animeUnity.name,
        description: "Welcome to AnimeUnity.",
        logo: animeUnity.logo,
        baseUrl: animeUnity.baseUrl,
        supportedLanguages: animeUnity.languages,
        routes: ["/:query", "/info/:id", "/episode/:episodeId"],
      });
    } catch (err) {
      console.error("Error in /animeunity route:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params as { query: string };

    if (!query) {
      return reply
        .status(400)
        .send({ message: "Query parameter is required." });
    }

    try {
      const result = await animeUnity.search(query);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in search:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/info/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const { page = 1 } = request.query as { page?: number };

    try {
      const result = await animeUnity.fetchInfo(id, page);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/*", async (request, reply) => {
    const episodeId = (request.params as any)["*"] as string;

    try {
      const result = await animeUnity.fetchSources(episodeId);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
