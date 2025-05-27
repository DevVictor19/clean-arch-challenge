import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { PaginatedResult } from "../../@shared/abstractions/repository";
import { BadRequestHttpError } from "../../@shared/errors/http";
import { ClientController } from "../controller";
import { CreateClientDTO, UpdateClientDTO } from "../dtos";
import { Client } from "../entity";
import { ClientQueueService } from "../queue";
import { ClientService } from "../service";
import { HttpRequest } from "../../@shared/abstractions/http";

// Mock dependencies
const mockClientService = {
  create: vi.fn(),
  update: vi.fn(),
  findById: vi.fn(),
  findPaginated: vi.fn(),
  delete: vi.fn(),
} as unknown as ClientService;

const mockClientQueueService = {
  sendWelcomeEmail: vi.fn(),
} as unknown as ClientQueueService;

// Mock Client class
vi.mock("../client", () => {
  return {
    Client: vi.fn().mockImplementation((data) => ({
      _id: data._id || "client-id",
      email: data.email,
      name: data.name,
      phone: data.phone,
    })),
  };
});

describe("ClientController", () => {
  let clientController: ClientController;

  beforeEach(() => {
    vi.clearAllMocks();
    clientController = new ClientController(
      mockClientService,
      mockClientQueueService
    );
  });

  describe("create", () => {
    const createDto: CreateClientDTO = {
      email: "test@example.com",
      name: "Test Client",
      phone: "1234567890",
    };

    it("should create a client and send welcome email", async () => {
      const client = new Client(createDto);
      (mockClientService.create as Mock).mockResolvedValue(client);
      (mockClientQueueService.sendWelcomeEmail as Mock).mockResolvedValue(
        undefined
      );

      const req: HttpRequest<null, null, CreateClientDTO> = { body: createDto };
      const result = await clientController.create(req);

      expect(mockClientService.create).toHaveBeenCalledWith(createDto);
      expect(mockClientQueueService.sendWelcomeEmail).toHaveBeenCalledWith(
        client
      );
      expect(result).toEqual({ status: 201, body: client });
    });

    it("should throw BadRequestHttpError if body is missing", async () => {
      const req: HttpRequest<null, null, CreateClientDTO> = { body: undefined };

      await expect(clientController.create(req)).rejects.toThrowError(
        new BadRequestHttpError("Insira o corpo da requisição")
      );
    });
  });

  describe("update", () => {
    const updateDto: UpdateClientDTO = {
      email: "updated@example.com",
      name: "Updated Client",
      phone: "0987654321",
    };
    const clientId = "client-id";
    const client = new Client({ ...updateDto, _id: clientId });

    it("should update a client successfully", async () => {
      (mockClientService.update as Mock).mockResolvedValue(client);

      const req: HttpRequest<{ id: string }, null, UpdateClientDTO> = {
        params: { id: clientId },
        body: updateDto,
      };
      const result = await clientController.update(req);

      expect(mockClientService.update).toHaveBeenCalledWith(
        clientId,
        updateDto
      );
      expect(result).toEqual({ status: 200, body: client });
    });

    it("should throw BadRequestHttpError if id is missing", async () => {
      const req: HttpRequest<{ id: string }, null, UpdateClientDTO> = {
        params: {},
        body: updateDto,
      };

      await expect(clientController.update(req)).rejects.toThrowError(
        new BadRequestHttpError("Parametro id é obrigatório")
      );
    });

    it("should throw BadRequestHttpError if body is missing", async () => {
      const req: HttpRequest<{ id: string }, null, UpdateClientDTO> = {
        params: { id: clientId },
        body: undefined,
      };

      await expect(clientController.update(req)).rejects.toThrowError(
        new BadRequestHttpError("Insira o corpo da requisição")
      );
    });
  });

  describe("findById", () => {
    const clientId = "client-id";
    const client = new Client({
      email: "test@example.com",
      name: "Test Client",
      phone: "1234567890",
      _id: clientId,
    });

    it("should find a client by id", async () => {
      (mockClientService.findById as Mock).mockResolvedValue(client);

      const req: HttpRequest<{ id: string }, null, null> = {
        params: { id: clientId },
      };
      const result = await clientController.findById(req);

      expect(mockClientService.findById).toHaveBeenCalledWith(clientId);
      expect(result).toEqual({ status: 200, body: client });
    });

    it("should throw BadRequestHttpError if id is missing", async () => {
      const req: HttpRequest<{ id: string }, null, null> = {
        params: {},
      };

      await expect(clientController.findById(req)).rejects.toThrowError(
        new BadRequestHttpError("Parametro id é obrigatório")
      );
    });
  });

  describe("findPaginated", () => {
    const paginatedResult: PaginatedResult<Client> = {
      page: 1,
      limit: 10,
      total: 50,
      results: 10,
      data: [
        new Client({
          email: "test@example.com",
          name: "Test Client",
          phone: "1234567890",
          _id: "client-id",
        }),
      ],
    };

    it("should return paginated results with default page and limit", async () => {
      (mockClientService.findPaginated as Mock).mockResolvedValue(
        paginatedResult
      );

      const req: HttpRequest<null, { page: string; limit: string }, null> = {
        query: {},
      };
      const result = await clientController.findPaginated(req);

      expect(mockClientService.findPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({ status: 200, body: paginatedResult });
    });

    it("should return paginated results with provided page and limit", async () => {
      (mockClientService.findPaginated as Mock).mockResolvedValue(
        paginatedResult
      );

      const req: HttpRequest<null, { page: string; limit: string }, null> = {
        query: { page: "2", limit: "20" },
      };
      const result = await clientController.findPaginated(req);

      expect(mockClientService.findPaginated).toHaveBeenCalledWith(2, 20);
      expect(result).toEqual({ status: 200, body: paginatedResult });
    });

    it("should use default values for invalid page or limit", async () => {
      (mockClientService.findPaginated as Mock).mockResolvedValue(
        paginatedResult
      );

      const req: HttpRequest<null, { page: string; limit: string }, null> = {
        query: { page: "invalid", limit: "invalid" },
      };
      const result = await clientController.findPaginated(req);

      expect(mockClientService.findPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({ status: 200, body: paginatedResult });
    });

    it("should use default limit if provided limit is greater than 100", async () => {
      (mockClientService.findPaginated as Mock).mockResolvedValue(
        paginatedResult
      );

      const req: HttpRequest<null, { page: string; limit: string }, null> = {
        query: { page: "2", limit: "150" },
      };
      const result = await clientController.findPaginated(req);

      expect(mockClientService.findPaginated).toHaveBeenCalledWith(2, 10);
      expect(result).toEqual({ status: 200, body: paginatedResult });
    });
  });

  describe("delete", () => {
    it("should delete a client successfully", async () => {
      (mockClientService.delete as Mock).mockResolvedValue(undefined);

      const req: HttpRequest<{ id: string }, null, null> = {
        params: { id: "client-id" },
      };
      const result = await clientController.delete(req);

      expect(mockClientService.delete).toHaveBeenCalledWith("client-id");
      expect(result).toEqual({ status: 200 });
    });

    it("should throw BadRequestHttpError if id is missing", async () => {
      const req: HttpRequest<{ id: string }, null, null> = {
        params: {},
      };

      await expect(clientController.delete(req)).rejects.toThrowError(
        new BadRequestHttpError("Parametro id é obrigatório")
      );
    });
  });
});
