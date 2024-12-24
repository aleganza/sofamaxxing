import "dotenv/config";

import FastifyCors from "@fastify/cors";
import chalk from "chalk";
import Fastify from "fastify";

import animeunity from "./routes/providers/animeunity";

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

  await fastify.register(animeunity, { prefix: "/animeunity" });

  fastify.get("/", (_, reply) => {
    reply
      .status(200)
      .send(
        "Welcome to 🛋️ sofamaxxing!\n/providers to see the available providers"
      );
  });

  fastify.get("/providers", (_, reply) => {
    reply.status(200).send({
      providers: [
        "/animeunity"
      ]
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
