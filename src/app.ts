import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "fastify-autoload";
import Fastify from "fastify";
import fastifyCors from "fastify-cors";

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

const app = Fastify({
  logger: true,
});

fastifyCors(app, { origin: process.env.FRONT_URL }, (err) =>
  err ? console.error("CORS error init", err) : null
);

// loads all plugins
app.register(AutoLoad, {
  dir: join(__dirname, "plugins"),
});

// loads all routes
app.register(AutoLoad, {
  dir: join(__dirname, "routes"),
});

export default app;
