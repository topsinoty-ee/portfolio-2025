import fastifyCookie from "@fastify/cookie";
import fastifySession from "@fastify/session";
import { randomUUID } from "node:crypto";
import { FastifyInstance } from "fastify";

declare module "fastify" {
  interface Session {
    auth?: {
      user: {
        email: string;
        role?: string;
      } | null;
      isAdmin?: boolean;
      isAuthenticated?: boolean;
    };
  }
}

export interface AppSession {
  auth?: {
    user: {
      email: string;
      role?: string;
    } | null;
  };
}

export const configureSession = async (app: FastifyInstance) => {
  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: process.env.SESSION_SECRET || randomUUID(),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    },
    saveUninitialized: false,
    cookiePrefix: "portfolio-2025",
  });
};
