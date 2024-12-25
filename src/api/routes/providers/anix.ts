import { FastifyInstance } from "fastify";
import Anix from "@consumet/extensions/dist/providers/anime/anix";

const anix = new Anix();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        name: anix.name,
        description: "Welcome to Anix.",
        routes: ["/:query", "/info/:id", "/episode/:episodeId"],
      });
    } catch (err) {
      console.error("Error in /anix route:", err);
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
      const result = await anix.search(query);
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
      const result = await anix.fetchAnimeInfo(id);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchAnimeInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/*", async (request, reply) => {
    const episodeId = (request.params as any)["*"] as string;

    try {
      const result = await anix.fetchEpisodeSources(episodeId.split("/")[0], episodeId.split("/")[1]);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
