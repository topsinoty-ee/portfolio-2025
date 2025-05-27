import { buildApp } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

const start = async () => {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT });
    console.log(`🚀 Server ready at ${app.server.address()}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

await start();
