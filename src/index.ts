import "dotenv/config";
import { FastifyInstance } from "fastify";

import app from "./app";

async function start(app: FastifyInstance) {
  try {
    const address = await app.listen(8000, "0.0.0.0");
    console.log(`Listening on ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start(app);
