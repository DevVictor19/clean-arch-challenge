import http from "node:http";
import { getEnv, loadEnv } from "./infra/env/env-config";
import { connectDB } from "./infra/mongo/connection";
import { mount } from "./app";
import { connectRedis, disconnectRedis } from "./infra/redis/connection";

let server: http.Server;

async function start() {
  try {
    loadEnv();
    await connectDB();
    await connectRedis();

    const app = mount();
    server = http.createServer(app);

    const PORT = getEnv().serverPort;

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("error while starting server: ", e);
  }
}
start();

async function shutdown() {
  console.log("Shutting down gracefully...");

  disconnectRedis();
  console.log("Redis client disconnected.");

  if (server) {
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  }

  setTimeout(() => {
    console.error("Forcing shutdown...");
    process.exit(1);
  }, 10000); // 10 segundos
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
