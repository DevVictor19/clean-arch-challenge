import morgan from "morgan";
import express, { Request, Response } from "express";

import { ClientService } from "./domain/clients/service";
import { MongoClientRepository } from "./infra/mongo/repositories/client";
import { ClientController } from "./domain/clients/controller";
import { createClientRouter } from "./infra/routers/client";
import { globalErrorMiddleware } from "./infra/middlewares/error";
import { RedisCache } from "./infra/redis/cache";
import { ClientCacheService } from "./domain/clients/cache";
import { RabbitMQueue } from "./infra/rabbitmq/queue";
import { ClientQueueService } from "./domain/clients/queue";

export function mount() {
  const app = express();
  const router = express.Router();

  const redisCache = new RedisCache();
  const rabbitMQueue = new RabbitMQueue();

  const mongoClientRepository = new MongoClientRepository();
  const clientQueueService = new ClientQueueService(rabbitMQueue);
  const clientCacheService = new ClientCacheService(redisCache);
  const clientService = new ClientService(
    mongoClientRepository,
    clientCacheService
  );
  const clientController = new ClientController(
    clientService,
    clientQueueService
  );
  const clientRouter = createClientRouter(clientController);

  app.use(morgan("common"));
  app.use(express.json());
  app.use("/v1", router);

  router.get("/health", (req: Request, res: Response) => {
    res.send({ message: "ok" });
  });

  router.use("/clients", clientRouter);

  app.use(globalErrorMiddleware);

  return app;
}
