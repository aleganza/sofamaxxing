import { FastifyInstance } from "fastify";
import AnimeParadise from "sofamaxxing.ts/dist/providers/AnimeParadise";

const animeParadise = new AnimeParadise();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        description: `Welcome to ${animeParadise.name}.`,
        routes: ["/:query", "/info/:id", "/episode/:episodeId"],
      });
    } catch (err) {
      console.error("Error in /animeParadise route:", err);
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
      const result = await animeParadise.search(query);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in search:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/info/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await animeParadise.fetchInfo(id);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/*", async (request, reply) => {
    const fullUrl = request.url;
    const episodeId = fullUrl.split("/episode/")[1];

    try {
      const result = await animeParadise.fetchSources(episodeId);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
