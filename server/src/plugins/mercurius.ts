import { FastifyPluginAsync } from "fastify";
import mercurius from "mercurius";
import { readFile } from "fs/promises";
import { resolvers } from "../resolvers";

export const graphqlPlugin: FastifyPluginAsync = async (app) => {
  const schema = await readFile(
    new URL("../schema.gql", import.meta.url),
    "utf8",
  );

  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true,
  });
};
