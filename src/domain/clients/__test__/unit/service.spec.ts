import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { PaginatedResult } from "../../../@shared/abstractions/repository";
import {
  ConflictHttpError,
  ValidationError,
  NotFoundHttpError,
  BadRequestHttpError,
} from "../../../@shared/errors/http";
import { ClientCacheService } from "../../cache";
import { CreateClientDTO, UpdateClientDTO } from "../../dtos";
import { Client } from "../../entity";
import { ClientRepository } from "../../repository";
import { ClientService } from "../../service";

// Mock dependencies
const mockClientRepository = {
  save: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  findById: vi.fn(),
  findAll: vi.fn(),
  findPaginated: vi.fn(),
  findByEmail: vi.fn(),
  findByPhone: vi.fn(),
} as unknown as ClientRepository;

const mockClientCacheService = {
  setById: vi.fn(),
  getById: vi.fn(),
  setByEmail: vi.fn(),
  getByEmail: vi.fn(),
  setByPhone: vi.fn(),
  getByPhone: vi.fn(),
} as unknown as ClientCacheService;

describe("ClientService", () => {
  let clientService: ClientService;

  beforeEach(() => {
    vi.clearAllMocks();
    clientService = new ClientService(
      mockClientRepository,
      mockClientCacheService
    );
  });

  describe("create", () => {
    const createDto: CreateClientDTO = {
      email: "test@gmail.com",
      name: "Test Client",
      phone: "1234567890",
    };

    it("should create a client successfully", async () => {
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(null);
      const client = new Client(createDto);
      (mockClientRepository.save as Mock).mockResolvedValue(client);

      const result = await clientService.create(createDto);

      expect(mockClientCacheService.getByEmail).toHaveBeenCalledWith(
        createDto.email
      );
      expect(mockClientCacheService.getByPhone).toHaveBeenCalledWith(
        createDto.phone
      );
      expect(mockClientRepository.save).toHaveBeenCalledWith(
        expect.any(Client)
      );
      expect(result).toEqual(client);
    });

    it("should throw ConflictHttpError if email is already in use", async () => {
      const existingClient = new Client({ ...createDto, _id: "existing-id" });
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(
        existingClient
      );

      await expect(clientService.create(createDto)).rejects.toThrowError(
        new ConflictHttpError("O email fornecido já está em uso")
      );
    });

    it("should throw ConflictHttpError if phone is already in use", async () => {
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      const existingClient = new Client({ ...createDto, _id: "existing-id" });
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(
        existingClient
      );

      await expect(clientService.create(createDto)).rejects.toThrowError(
        new ConflictHttpError("O telefone fornecido já está em uso")
      );
    });

    it("should throw ValidationError if client data is invalid", async () => {
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(null);
      vi.spyOn(Client.prototype, "validate").mockReturnValue({
        valid: false,
        errors: { email: "Invalid email" },
      });

      await expect(clientService.create(createDto)).rejects.toThrowError(
        new ValidationError("Dados de cliente inválidos", {
          email: "Invalid email",
        })
      );
    });
  });

  describe("update", () => {
    const updateDto: UpdateClientDTO = {
      email: "test@email.com",
      name: "Updated Client",
      phone: "1234567890",
    };
    const clientId = "client email";
    const existingClient = new Client({ ...updateDto, _id: clientId });

    it("should update a client successfully", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(
        existingClient
      );
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(null);
      (mockClientRepository.update as Mock).mockResolvedValue(existingClient);
      vi.spyOn(Client.prototype, "validate").mockReturnValue({
        valid: true,
      });

      const result = await clientService.update(clientId, updateDto);

      expect(mockClientCacheService.getById).toHaveBeenCalledWith(clientId);
      expect(mockClientCacheService.getByEmail).toHaveBeenCalledWith(
        updateDto.email
      );
      expect(mockClientCacheService.getByPhone).toHaveBeenCalledWith(
        updateDto.phone
      );
      expect(mockClientRepository.update).toHaveBeenCalledWith(
        clientId,
        expect.any(Client)
      );
      expect(result).toEqual(existingClient);
    });

    it("should throw NotFoundHttpError if client does not exist", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(null);
      (mockClientRepository.findById as Mock).mockResolvedValue(null);

      await expect(
        clientService.update(clientId, updateDto)
      ).rejects.toThrowError(new NotFoundHttpError("Cliente não encontrado"));
    });

    it("should throw ConflictHttpError if email is already in use by another client", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(
        existingClient
      );
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(
        new Client({ ...updateDto, _id: "other-id" })
      );

      await expect(
        clientService.update(clientId, updateDto)
      ).rejects.toThrowError(
        new ConflictHttpError("Outro cliente já possui esse email cadastrado")
      );
    });

    it("should throw ConflictHttpError if phone is already in use by another client", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(
        existingClient
      );
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(
        new Client({ ...updateDto, _id: "other-id" })
      );

      await expect(
        clientService.update(clientId, updateDto)
      ).rejects.toThrowError(
        new ConflictHttpError(
          "Outro cliente já possui esse telefone cadastrado"
        )
      );
    });

    it("should throw ValidationError if updated client data is invalid", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(
        existingClient
      );
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(null);
      vi.spyOn(Client.prototype, "validate").mockReturnValue({
        valid: false,
        errors: { email: "Invalid email" },
      });

      await expect(
        clientService.update(clientId, updateDto)
      ).rejects.toThrowError(
        new ValidationError("Dados de cliente inválidos", {
          email: "Invalid email",
        })
      );
    });
  });

  describe("findById", () => {
    it("should return client if found", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getById as Mock).mockResolvedValue(client);

      const result = await clientService.findById("client-id");

      expect(mockClientCacheService.getById).toHaveBeenCalledWith("client-id");
      expect(result).toEqual(client);
    });

    it("should throw NotFoundHttpError if client not found", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(null);
      (mockClientRepository.findById as Mock).mockResolvedValue(null);

      await expect(clientService.findById("client-id")).rejects.toThrowError(
        new NotFoundHttpError("Cliente não encontrado")
      );
    });
  });

  describe("findByIdWithCache", () => {
    it("should return client from cache if available", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getById as Mock).mockResolvedValue(client);

      const result = await clientService.findByIdWithCache("client-id");

      expect(mockClientCacheService.getById).toHaveBeenCalledWith("client-id");
      expect(mockClientRepository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(client);
    });

    it("should fetch from repository and cache if not in cache", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getById as Mock).mockResolvedValue(null);
      (mockClientRepository.findById as Mock).mockResolvedValue(client);
      (mockClientCacheService.setById as Mock).mockResolvedValue(undefined);

      const result = await clientService.findByIdWithCache("client-id");

      expect(mockClientCacheService.getById).toHaveBeenCalledWith("client-id");
      expect(mockClientRepository.findById).toHaveBeenCalledWith("client-id");
      expect(mockClientCacheService.setById).toHaveBeenCalledWith(
        "client-id",
        client
      );
      expect(result).toEqual(client);
    });

    it("should return null if client not found", async () => {
      (mockClientCacheService.getById as Mock).mockResolvedValue(null);
      (mockClientRepository.findById as Mock).mockResolvedValue(null);

      const result = await clientService.findByIdWithCache("client-id");

      expect(result).toBeNull();
    });
  });

  describe("findByEmailWithCache", () => {
    it("should return client from cache if available", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(client);

      const result = await clientService.findByEmailWithCache(
        "test@example.com"
      );

      expect(mockClientCacheService.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockClientRepository.findByEmail).not.toHaveBeenCalled();
      expect(result).toEqual(client);
    });

    it("should fetch from repository and cache if not in cache", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getByEmail as Mock).mockResolvedValue(null);
      (mockClientRepository.findByEmail as Mock).mockResolvedValue(client);
      (mockClientCacheService.setByEmail as Mock).mockResolvedValue(undefined);

      const result = await clientService.findByEmailWithCache(
        "test@example.com"
      );

      expect(mockClientCacheService.getByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockClientRepository.findByEmail).toHaveBeenCalledWith(
        "test@example.com"
      );
      expect(mockClientCacheService.setByEmail).toHaveBeenCalledWith(
        "test@example.com",
        client
      );
      expect(result).toEqual(client);
    });
  });

  describe("findByPhoneWithCache", () => {
    it("should return client from cache if available", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(client);

      const result = await clientService.findByPhoneWithCache("1234567890");

      expect(mockClientCacheService.getByPhone).toHaveBeenCalledWith(
        "1234567890"
      );
      expect(mockClientRepository.findByPhone).not.toHaveBeenCalled();
      expect(result).toEqual(client);
    });

    it("should fetch from repository and cache if not in cache", async () => {
      const client = new Client({
        email: "test@example.com",
        name: "Test",
        phone: "1234567890",
        _id: "client-id",
      });
      (mockClientCacheService.getByPhone as Mock).mockResolvedValue(null);
      (mockClientRepository.findByPhone as Mock).mockResolvedValue(client);
      (mockClientCacheService.setByPhone as Mock).mockResolvedValue(undefined);

      const result = await clientService.findByPhoneWithCache("1234567890");

      expect(mockClientCacheService.getByPhone).toHaveBeenCalledWith(
        "1234567890"
      );
      expect(mockClientRepository.findByPhone).toHaveBeenCalledWith(
        "1234567890"
      );
      expect(mockClientCacheService.setByPhone).toHaveBeenCalledWith(
        "1234567890",
        client
      );
      expect(result).toEqual(client);
    });
  });

  describe("findPaginated", () => {
    it("should return paginated results", async () => {
      const paginatedResult: PaginatedResult<Client> = {
        page: 1,
        limit: 10,
        total: 50,
        results: 10,
        data: [
          new Client({
            email: "test@example.com",
            name: "Test",
            phone: "1234567890",
            _id: "client-id",
          }),
        ],
      };
      (mockClientRepository.findPaginated as Mock).mockResolvedValue(
        paginatedResult
      );

      const result = await clientService.findPaginated(1, 10);

      expect(mockClientRepository.findPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResult);
    });

    it("should throw BadRequestHttpError if page is less than or equal to 0", async () => {
      await expect(clientService.findPaginated(0, 10)).rejects.toThrowError(
        new BadRequestHttpError(
          "O parâmetro 'page' da paginação deve ser maior que 0"
        )
      );
    });

    it("should throw BadRequestHttpError if limit is greater than 100", async () => {
      await expect(clientService.findPaginated(1, 101)).rejects.toThrowError(
        new BadRequestHttpError(
          "O parâmetro 'limit' da paginação não pode ser maior que 100"
        )
      );
    });
  });

  describe("delete", () => {
    it("should delete a client successfully", async () => {
      (mockClientRepository.delete as Mock).mockResolvedValue(undefined);

      await clientService.delete("client-id");

      expect(mockClientRepository.delete).toHaveBeenCalledWith("client-id");
    });
  });
});
