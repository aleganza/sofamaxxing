import "dotenv/config";

import FastifyCors from "@fastify/cors";
import chalk from "chalk";
import Fastify from "fastify";

import animeunity from "./routes/providers/animeunity";
import anix from "./routes/providers/anix";

const fastify = Fastify({
  maxParamLength: 1000,
  logger: true,
});

const PORT = Number(process.env.PORT) || 3000;

(async () => {
  await fastify.register(FastifyCors, {
    origin: "*",
    methods: "GET",
  });

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

  fastify.get("/", (_, reply) => {
    reply
      .status(200)
      .send(
        "Welcome to 🛋️ sofamaxxing!\n/providers to see the available providers"
      );
  });

  fastify.get("/providers", (_, reply) => {
    reply.status(200).send({
      providers: ["/animeunity", "/anix"],
    });
  });

  fastify.get("*", (_, reply) => {
    reply.status(404).send({
      message: "",
      error: "Page Not Found",
    });
  });

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    console.log(chalk.green(`Server listening on http://localhost:${PORT}`));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
