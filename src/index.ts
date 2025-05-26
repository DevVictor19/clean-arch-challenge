import http from "node:http";
import { app } from "./app";
import { getEnv, loadEnv } from "./infra/env/env-config";
import { connectDB } from "./infra/mongo/connection";

async function start() {
  try {
    loadEnv();
    await connectDB();

    const server = http.createServer(app);

    const PORT = getEnv().serverPort;

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("error while starting server: ", e);
  }
}
start();
