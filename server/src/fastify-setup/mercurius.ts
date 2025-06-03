import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { AppSession } from "@/fastify-setup/session";
import { User } from "@/schemas/user";
import mercurius, { IResolvers } from "mercurius";

declare module "mercurius" {
  interface MercuriusContext {
    req: FastifyRequest;
    reply: FastifyReply;
    session: AppSession;
    user: InstanceType<typeof User> | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isUser: boolean;
  }
}

export const configureMercurius = async (
  app: FastifyInstance,
  schema: string,
  resolvers: IResolvers,
) => {
  await app.register(mercurius, {
    schema,
    resolvers,
    context: async (req, reply) => {
      let user = null;
      const sessionUserEmail = req.session.auth?.user?.email;

      if (sessionUserEmail) {
        try {
          user = await User.findOne({ email: sessionUserEmail })
            .collation({ locale: "en", strength: 2 })
            .exec();

          if (!user) {
            user = await User.create({
              email: sessionUserEmail,
              role: req.session.auth?.user?.role || "user",
            });
          }
        } catch (error) {
          console.error("User lookup/creation failed:", error);
        }
      }

      return {
        req,
        reply,
        session: req.session,
        user,
        isAuthenticated: req.session.auth?.isAuthenticated || false,
        isAdmin: user?.role === "admin",
        isUser: user?.role === "user",
      };
    },
    graphiql: process.env.NODE_ENV !== "production",
  });
};
