import { FastifyPluginAsync } from "fastify";

export const graphqlRoute: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const query = `{ hello }`;
    return reply.graphql(query);
  });
};
