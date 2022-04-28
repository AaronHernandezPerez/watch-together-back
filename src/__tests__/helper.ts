import app from "../app";

// Automatically build and tear down our instance
function build() {
  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(() => app.close());

  return app;
}

export { build };
