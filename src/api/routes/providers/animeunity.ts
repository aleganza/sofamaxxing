import { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';

import AnimeUnity from '../../../providers/AnimeUnity';

const animeUnity = new AnimeUnity();

const routes = async (fastify: FastifyInstance) => {
  fastify.get("/", async (_, reply) => {
    try {
      return reply.status(200).send({
        description: `Welcome to ${animeUnity.name}.`,
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

    if (!episodeId) {
      return reply
        .status(400)
        .send({ message: "Episode ID parameter is required." });
    }

    const url = `${animeUnity.baseUrl}/episode/${episodeId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": request.headers["user-agent"] || "Mozilla/5.0",
          Cookie: request.headers["cookie"] || "",
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch episode: ${response.statusText}`);
        return reply
          .status(response.status)
          .send({ error: `Failed to fetch resource from ${url}` });
      }

      const data = await response.text();
      return reply
        .status(response.status)
        .headers(Object.fromEntries(response.headers.entries()))
        .send(data);
    } catch (err) {
      console.error("Error in fetchSources:", err);
      return reply.status(500).send({ message: "Internal server error" });
    }
  });
};

export default routes;
