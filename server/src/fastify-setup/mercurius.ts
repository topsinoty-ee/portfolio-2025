import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import mercurius, {IResolvers} from "mercurius";
import {verifyToken} from "@/utils/verifyJWT";

interface UserInfo {
  sub?: string;
  nickname?: string;
  name?: string;
  picture?: string;
  updated_at?: string;
  email?: string;
  isAdmin?: boolean;
  
  [key: string]: string | boolean | undefined;
}

const isUserInfo = (value: unknown): value is UserInfo => {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.sub === "string" && typeof obj.email === "string";
};

declare module "mercurius" {
  interface MercuriusContext {
    req: FastifyRequest;
    reply: FastifyReply;
    auth: {
      isAuthenticated: boolean;
      token: string;
      user?: UserInfo;
    };
  }
}

export const configureMercurius = async (
  app: FastifyInstance,
  schema: string,
  resolvers: IResolvers
): Promise<void> => {
  const getAuthContext = async (req: FastifyRequest) => {
    const authHeader = req.headers.authorization || "";
    
    if (!authHeader.startsWith("Bearer ")) {
      return {
        isAuthenticated: false,
        token: authHeader,
      };
    }
    
    const token = authHeader.split(" ")[1];
    try {
      const {aud} = await verifyToken(token);
      if (!aud || !Array.isArray(aud) || aud.length < 2) {
        throw new Error("Invalid audience in token");
      }
      const response = await fetch(aud[1], {
        headers: {Authorization: `Bearer ${token}`},
      });
      
      if (!response.ok) throw new Error("Failed to fetch user info");
      
      const userData = await response.json();
      if (!isUserInfo(userData)) throw new Error("Invalid user info format");
      
      const isAdmin = userData.email === "oluwatobilobatemi05@gmail.com";
      return {
        isAuthenticated: true,
        token: authHeader,
        user: {...userData, isAdmin},
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        token: authHeader,
      };
    }
  };
  
  await app.register(mercurius, {
    schema,
    resolvers,
    context: async (req, reply) => {
      const auth = await getAuthContext(req);
      return {req, reply, auth};
    },
    graphiql: process.env.NODE_ENV !== "production",
  });
};
