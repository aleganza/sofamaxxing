import { FastifyInstance } from "fastify";
import Gogoanime from "@consumet/extensions/dist/providers/anime/gogoanime";

const gogoanime = new Gogoanime();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        description: `Welcome to ${gogoanime.name}.`,
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
      const result = await gogoanime.search(query);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in search:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/info/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await gogoanime.fetchAnimeInfo(id);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchAnimeInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/:episodeId", async (request, reply) => {
    const { episodeId } = request.params as { episodeId: string };

    try {
      const result = await gogoanime.fetchEpisodeSources(episodeId);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
