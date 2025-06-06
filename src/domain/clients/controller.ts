import { HttpRequest, HttpResponse } from "../@shared/abstractions/http";
import { BadRequestHttpError } from "../@shared/errors/http";
import { CreateClientDTO, UpdateClientDTO } from "./dtos";
import { ClientQueueService } from "./queue";
import { ClientService } from "./service";

export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly clientQueueService: ClientQueueService
  ) {}

  async create(
    req: HttpRequest<null, null, CreateClientDTO>
  ): Promise<HttpResponse> {
    const dto = req.body;

    if (!dto) {
      throw new BadRequestHttpError("Insira o corpo da requisição");
    }

    const result = await this.clientService.create(dto);

    await this.clientQueueService.sendWelcomeEmail(result);

    return {
      status: 201,
      body: result,
    };
  }

  async update(
    req: HttpRequest<{ id: string }, null, UpdateClientDTO>
  ): Promise<HttpResponse> {
    const id = req.params?.id;
    const dto = req.body;

    if (!id) {
      throw new BadRequestHttpError("Parametro id é obrigatório");
    }

    if (!dto) {
      throw new BadRequestHttpError("Insira o corpo da requisição");
    }

    const result = await this.clientService.update(id, dto);

    return {
      status: 200,
      body: result,
    };
  }

  async findById(
    req: HttpRequest<{ id: string }, null, null>
  ): Promise<HttpResponse> {
    const id = req.params?.id;

    if (!id) {
      throw new BadRequestHttpError("Parametro id é obrigatório");
    }

    const result = await this.clientService.findById(id);

    return {
      status: 200,
      body: result,
    };
  }

  async findPaginated(
    req: HttpRequest<null, { page: string; limit: string }, null>
  ): Promise<HttpResponse> {
    let page: number = 1;
    let limit: number = 10;

    if (typeof req.query?.page === "string" && !isNaN(Number(req.query.page))) {
      const parsed = Number(req.query.page);
      if (Number.isInteger(parsed) && parsed > 0) {
        page = parsed;
      }
    }

    if (
      typeof req.query?.limit === "string" &&
      !isNaN(Number(req.query.limit))
    ) {
      const parsed = Number(req.query.limit);
      if (Number.isInteger(parsed) && parsed > 0 && parsed < 100) {
        limit = parsed;
      }
    }

    const result = await this.clientService.findPaginated(page, limit);

    return {
      status: 200,
      body: result,
    };
  }

  async delete(
    req: HttpRequest<{ id: string }, null, null>
  ): Promise<HttpResponse> {
    const id = req.params?.id;

    if (!id) {
      throw new BadRequestHttpError("Parametro id é obrigatório");
    }

    await this.clientService.delete(id);

    return {
      status: 200,
    };
  }
}
