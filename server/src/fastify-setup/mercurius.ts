import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import mercurius, {IResolvers} from 'mercurius';
import {verifyToken} from '@/utils/verifyJWT';

type UserInfo = Record<'sub' | 'nickname' | 'name' | 'picture' | 'updated_at' | 'email' | string, string | undefined>;

const isUserInfo = (value: unknown): value is UserInfo => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return typeof obj.sub === 'string' && typeof obj.email === 'string';
};

declare module 'mercurius' {
  interface MercuriusContext {
    req: FastifyRequest;
    reply: FastifyReply;
    auth: {
      isAuthenticated: boolean; token: string; user?: UserInfo;
    };
  }
}

export const configureMercurius = async (app: FastifyInstance, schema: string, resolvers: IResolvers): Promise<void> => {
  const getAuthContext = async (req: FastifyRequest) => {
    const authHeader = req.headers.authorization || '';
    
    if (!authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false, token: authHeader
      };
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const {aud} = await verifyToken(token);
      
      const response = await fetch(aud[1], {
        headers: {Authorization: `Bearer ${token}`}
      });
      
      if (!response.ok) throw new Error('Failed to fetch user info');
      
      
      const userData = await response.json();
      if (!isUserInfo(userData)) throw new Error('Invalid user info format');
      
      
      return {
        isAuthenticated: true, token: authHeader, user: userData
      };
    } catch (error) {
      return {
        isAuthenticated: false, token: authHeader
      };
    }
  };
  
  await app.register(mercurius, {
    schema, resolvers, context: async (req, reply) => {
      const auth = await getAuthContext(req);
      return {req, reply, auth};
    }, graphiql: process.env.NODE_ENV !== 'production',
  });
};