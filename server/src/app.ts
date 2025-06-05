import Fastify from "fastify";
import {graphqlRoutes} from "./routes/gql";
import {resolvers} from "./resolvers";
import {readFileSync} from "fs";
import {configureSession} from "@/fastify-setup/session";
import {configureMercurius} from "@/fastify-setup/mercurius";
import {configureCors} from "@/fastify-setup/cors";

export const buildApp = async () => {
  const app = Fastify();
  await configureCors(app);
  await configureSession(app);
  
  const schema = readFileSync(
    new URL("./schema.graphql", import.meta.url),
    "utf8",
  );
  await configureMercurius(app, schema, resolvers);
  await app.register(graphqlRoutes);
  
  return app;
};
