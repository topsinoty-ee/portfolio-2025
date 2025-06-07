import {FastifyPluginAsync} from "fastify";

export const graphqlRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    return reply.redirect("/graphiql");
  });
};
