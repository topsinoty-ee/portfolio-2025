import Fastify from "fastify";
import { graphqlPlugin } from "./plugins/mercurius";
import { graphqlRoute } from "./routes/gql";

export const buildApp = async () => {
  const app = Fastify({ logger: true });

  await app.register(graphqlPlugin);
  await app.register(graphqlRoute);

  return app;
};
