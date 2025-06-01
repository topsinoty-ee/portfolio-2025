import { FastifyPluginAsync } from "fastify";

export const graphqlRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    // const query = `{
    //  sayHello(name: "Promise", message: "Hello World"){
    //     name,
    //     message
    //   }
    //  }`;
    // return reply.graphql(query);
    return reply.redirect("/graphiql");
  });
};
