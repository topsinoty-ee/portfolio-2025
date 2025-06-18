import {buildApp} from "./app";
import {connectToDatabase, disconnectFromDatabase} from "./db";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const start = async () => {
  try {
    await connectToDatabase();
    
    const app = await buildApp();
    await app.listen({port: PORT});
    
    const address = app.server.address();
    if (typeof address === "string") {
      console.log(`🚀 Server ready at ${address}`);
    } else {
      console.log(
        `🚀 Server ready at http://[${address.address}]:${address.port}`,
      );
    }
    
    const shutdown = async () => {
      console.log("Shutting down server...");
      await disconnectFromDatabase();
      process.exit(0);
    };
    
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

await start();
