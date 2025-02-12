import { FastifyInstance } from "fastify";
import AniPlay from "../../../providers/AniPlay";

const aniplay = new AniPlay();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        description: `Welcome to ${aniplay.name}.`,
        routes: ["/:query", "/info/:id", "/episode/:episodeId"],
      });
    } catch (err) {
      console.error("Error in /aniplay route:", err);
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
      const result = await aniplay.search(query);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in search:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/info/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const result = await aniplay.fetchInfo(id);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchInfo:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });

  fastify.get("/episode/:id", async (request, reply) => {
    const fullUrl = request.url;
    const episodeId = fullUrl.split("/episode/")[1].split("&")[0];

    const { host = "yuki" } = request.query as {
      host?: "maze" | "pahe" | "yuki";
    };
    const { type = "sub" } = request.params as { type?: "sub" | "dub" };

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
      const result = await aniplay.fetchSources(episodeId, host, type);
      return reply.status(200).send(result);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
