import mongoose from "mongoose";
import { dbSecret } from "./config";

if (!dbSecret) throw new Error("DB_SECRET not set");

const uri = `mongodb+srv://topsinoty:${dbSecret}@cluster0.1heokz5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let isConnected = false;
let idleTimeout: NodeJS.Timeout | null = null;

export async function connectToDatabase(): Promise<void> {
  if (isConnected) return;

  await mongoose.connect(uri, { family: 4, dbName: "portfolio" });
  await mongoose.connection.db.admin().command({ ping: 1 });
  console.log("Connected to MongoDB!");
  isConnected = true;
}

export async function disconnectFromDatabase(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  console.log("Disconnected from MongoDB!");
  isConnected = false;
}

export async function useDatabaseConnection(): Promise<void> {
  if (idleTimeout) {
    clearTimeout(idleTimeout);
    idleTimeout = null;
  }

  if (!isConnected) {
    await connectToDatabase();
  }

  idleTimeout = setTimeout(
    () => {
      disconnectFromDatabase().catch(console.error);
    },
    5 * 60 * 1000,
  );
}
