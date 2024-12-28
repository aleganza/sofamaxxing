import { FastifyInstance } from "fastify";
import Zoro from "@consumet/extensions/dist/providers/anime/zoro";
import { StreamingServers } from "@consumet/extensions";

const zoro = new Zoro();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        description: `Welcome to ${zoro.name}.`,
        routes: ["/:query", "/info/:id", "/episode/:episodeId"],
      });
    } catch (err) {
      console.error("Error in /anix route:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/:query", async (request, reply) => {
    const { query } = request.params as { query: string };
    const { page = 1 } = request.query as { page?: number };

    if (!query) {
      return reply
        .status(400)
        .send({ message: "Query parameter is required." });
    }

    try {
      const result = await zoro.search(query);
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
      const result = await zoro.fetchAnimeInfo(id);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchAnimeInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/:episodeId", async (request, reply) => {
    const { episodeId } = request.params as { episodeId: string };

    try {
      const result = await zoro.fetchEpisodeSources(episodeId);
      return reply.status(200).send(result);
    } finally {
      try {
        const fallbackResult = await zoro.fetchEpisodeSources(
          episodeId,
          StreamingServers.VidStreaming
        );
        return reply.status(200).send(fallbackResult);
      } catch (fallbackErr) {
        return reply.status(500).send({ message: fallbackErr });
      }
    }
  });
};

export default routes;
