import Fastify from "fastify";
import { graphqlRoutes } from "./routes/gql";
import mercurius from "mercurius";
import { resolvers } from "./resolvers";
import { readFileSync } from "fs";

export const buildApp = async () => {
  const app = Fastify();

  await app.register(async (instance) => {
    const schema = readFileSync(
      new URL("./schema.gql", import.meta.url),
      "utf8",
    );

    instance.register(mercurius, {
      schema,
      resolvers,
      context: async (req, reply) => {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) return {};
      },
      graphiql: true,
    });
    await instance.register(graphqlRoutes);
  });

  return app;
};
