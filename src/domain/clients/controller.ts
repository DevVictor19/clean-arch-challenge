import { HttpRequest, HttpResponse } from "../@shared/abstractions/http";
import { CreateClientDTO, UpdateClientDTO } from "./dtos";
import { ClientService } from "./service";

export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async create(
    req: HttpRequest<null, null, CreateClientDTO>
  ): Promise<HttpResponse> {
    const dto = req.body;

    const result = await this.clientService.create(dto);

    return {
      status: 201,
      body: result,
    };
  }

  async update(
    req: HttpRequest<{ id: string }, null, UpdateClientDTO>
  ): Promise<HttpResponse> {
    const id = req.params.id;
    const dto = req.body;

    const result = await this.clientService.update(id, dto);

    return {
      status: 200,
      body: result,
    };
  }

  async findById(
    req: HttpRequest<{ id: string }, null, null>
  ): Promise<HttpResponse> {
    const id = req.params.id;

    const result = await this.clientService.findById(id);

    return {
      status: 200,
      body: result,
    };
  }

  async findPaginated(
    req: HttpRequest<{ page: string; limit: string }, null, null>
  ): Promise<HttpResponse> {
    const page = Number(req.params.page);
    const limit = Number(req.params.limit);

    const result = await this.clientService.findPaginated(page, limit);

    return {
      status: 200,
      body: result,
    };
  }

  async delete(
    req: HttpRequest<{ id: string }, null, null>
  ): Promise<HttpResponse> {
    const id = req.params.id;

    await this.clientService.delete(id);

    return {
      status: 200,
    };
  }
}
