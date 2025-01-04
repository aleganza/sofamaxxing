import "dotenv/config";

import FastifyCors from "@fastify/cors";
import Fastify from "fastify";
import chalk from "chalk";
import animeunity from "./routes/providers/animeunity";
import anix from "./routes/providers/anix";
import gogoanime from "./routes/providers/gogoanime";
import zoro from "./routes/providers/zoro";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { inject } from "@vercel/analytics";
import fastifyRateLimit from "@fastify/rate-limit";

const fastify = Fastify({
  maxParamLength: 1000,
  bodyLimit: 1048576,
  logger: true,
});

const PORT = Number(process.env.PORT) || 5125;

(async () => {
  await fastify.register(FastifyCors, {
    origin: "*",
    methods: "GET",
  });

  // rate limiting
  await fastify.register(fastifyRateLimit, {
    global: true,
    max: 30,
    timeWindow: "1 minute",
    cache: 10000,
  });

  // rate limit 404 page
  fastify.setNotFoundHandler(
    {
      preHandler: fastify.rateLimit({
        max: 4,
        timeWindow: 500,
      }),
    },
    function (_, reply) {
      reply.code(404).send({ error: "Page Not Found" });
    }
  );

  // api-key protection in production
  fastify.addHook("preHandler", async (request, reply) => {
    if (process.env.NODE_ENV === "development") return;

    const apiKey = request.headers["x-api-key"];

    if (!apiKey) {
      return reply.status(400).send({ message: "API Key is required" });
    }

    if (apiKey !== process.env.API_KEY) {
      return reply.status(403).send({ message: "Forbidden: Invalid API Key" });
    }
  });

  // regiser providers
  await fastify.register(animeunity, { prefix: "/animeunity" });
  await fastify.register(anix, { prefix: "/anix" });
  await fastify.register(gogoanime, { prefix: "/gogoanime" });
  await fastify.register(zoro, { prefix: "/zoro" });

  // proxy
  fastify.get("/proxy", async (request, reply) => {
    const { url } = request.query as { url: string };

    if (!url) {
      return reply.status(400).send({ error: 'Missing "url" query parameter' });
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": request.headers["user-agent"] || "Mozilla/5.0",
          Cookie: request.headers["cookie"] || "",
          Accept: request.headers["accept"] || "*/*",
        },
      });

      if (!response.ok) {
        return reply.status(response.status).send({
          error: `Failed to fetch resource. Status: ${response.status}`,
        });
      }

      const data = await response.text();

      reply
        .status(response.status)
        .headers(Object.fromEntries(response.headers.entries()))
        .send(data);
    } catch (error) {
      reply
        .status(500)
        .send({ error: "Proxy Error", details: (error as Error).message });
    }
  });

  fastify.get("/", (_, reply) => {
    reply
      .status(200)
      .send(
        "Welcome to 🛋️ sofamaxxing!\n/providers to see the available providers"
      );
  });

  fastify.get("/providers", (_, reply) => {
    reply.status(200).send({
      providers: ["/animeunity", "/anix", "/gogoanime", "/zoro"],
    });
  });

  fastify.get("*", (_, reply) => {
    reply.status(404).send({
      message: "",
      error: "Page Not Found",
    });
  });

  if (process.env.NODE_ENV === "development") {
    try {
      await fastify.listen({ port: PORT, host: "0.0.0.0" });
      console.log(chalk.green(`Server listening on http://localhost:${PORT}`));
    } catch (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  }
})();

export default async (req: VercelRequest, res: VercelResponse) => {
  inject();
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
