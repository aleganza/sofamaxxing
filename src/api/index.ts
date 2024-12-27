import "dotenv/config";

import FastifyCors from "@fastify/cors";
import Fastify from "fastify";

import animeunity from "./routes/providers/animeunity";
import anix from "./routes/providers/anix";
import gogoanime from "./routes/providers/gogoanime";
import zoro from "./routes/providers/zoro"
import { VercelRequest, VercelResponse } from "@vercel/node";
import { inject } from "@vercel/analytics";
import fastifyRateLimit from "@fastify/rate-limit";

const fastify = Fastify({
  maxParamLength: 1000,
  bodyLimit: 1048576,
  logger: true,
});

// const PORT = Number(process.env.PORT) || 3000;

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
})();

export default async (req: VercelRequest, res: VercelResponse) => {
  inject();
  await fastify.ready();
  fastify.server.emit("request", req, res);
};
