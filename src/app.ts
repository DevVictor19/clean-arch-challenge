import morgan from "morgan";
import express, { Request, Response } from "express";

import { ClientService } from "./domain/clients/service";
import { MongoClientRepository } from "./infra/mongo/client";
import { ClientController } from "./domain/clients/controller";
import { createClientRouter } from "./infra/routers/client";
import { globalErrorMiddleware } from "./infra/middlewares/error";

export const app = express();
const router = express.Router();

const mongoClientRepository = new MongoClientRepository();
const clientService = new ClientService(mongoClientRepository);
const clientController = new ClientController(clientService);
const clientRouter = createClientRouter(clientController);

app.use(morgan("common"));
app.use(express.json());
app.use("/v1", router);

router.get("/health", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});

router.use("/clients", clientRouter);

app.use(globalErrorMiddleware);
