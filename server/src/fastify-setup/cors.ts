import {FastifyInstance} from "fastify";
import cors from "@fastify/cors";

export const configureCors = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: [
      "localhost:5173",
      "http://localhost:5173",
      "https://topsinoty.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 60 * 60 * 24 * 365,
  });
};
