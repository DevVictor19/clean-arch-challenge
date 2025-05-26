import { Router } from "express";
import { ClientController } from "../../domain/clients/controller";
import { adaptExpressRequest, adaptExpressResponse } from "../adapters/express";

export function createClientRouter(clientController: ClientController): Router {
  const router = Router();

  router.post("/", async (req, res) => {
    const httpRequest = adaptExpressRequest(req);
    const httpResponse = await clientController.create(httpRequest);
    adaptExpressResponse(res, httpResponse);
  });

  router.get("/", async (req, res) => {
    const httpRequest = adaptExpressRequest(req);
    const httpResponse = await clientController.findPaginated(httpRequest);
    adaptExpressResponse(res, httpResponse);
  });

  router.get("/:id", async (req, res) => {
    const httpRequest = adaptExpressRequest(req);
    const httpResponse = await clientController.findById(httpRequest);
    adaptExpressResponse(res, httpResponse);
  });

  router.put("/:id", async (req, res) => {
    const httpRequest = adaptExpressRequest(req);
    const httpResponse = await clientController.update(httpRequest);
    adaptExpressResponse(res, httpResponse);
  });

  router.delete("/:id", async (req, res) => {
    const httpRequest = adaptExpressRequest(req);
    const httpResponse = await clientController.delete(httpRequest);
    adaptExpressResponse(res, httpResponse);
  });

  return router;
}
