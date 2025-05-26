import express, { Request, Response } from "express";
import morgan from "morgan";

export const app = express();

const router = express.Router();

app.use(morgan("common"));
app.use("/v1", router);

router.get("/health", (req: Request, res: Response) => {
  res.send({ message: "ok" });
});
