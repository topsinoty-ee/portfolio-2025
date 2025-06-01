import dotenv from "dotenv";

dotenv.config();

const dbSecret = process.env.DB_SECRET;

export { dbSecret };
