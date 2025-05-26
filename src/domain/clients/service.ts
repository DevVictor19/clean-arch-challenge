import { CacheService } from "../@shared/abstractions/services/cache";
import {
  BadRequestHttpError,
  ConflictHttpError,
  NotFoundHttpError,
  ValidationError,
} from "../@shared/errors/http";
import { CreateClientDTO, UpdateClientDTO } from "./dtos";
import { Client } from "./entity";
import { ClientRepository } from "./repository";

export class ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly cacheService: CacheService
  ) {}

  async create(dto: CreateClientDTO) {
    const [withSameEmail, withSamePhone] = await Promise.all([
      this.clientRepository.findByEmail(dto.email),
      this.clientRepository.findByPhone(dto.phone),
    ]);

    if (withSameEmail) {
      throw new ConflictHttpError("O email fornecido já está em uso");
    }

    if (withSamePhone) {
      throw new ConflictHttpError("O telefone fornecido já está em uso");
    }

    const model = new Client({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
    });

    const validation = model.validate();

    if (!validation.valid) {
      throw new ValidationError(
        "Dados de cliente inválidos",
        validation.errors
      );
    }

    return this.clientRepository.save(model);
  }

  async update(id: string, dto: UpdateClientDTO) {
    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundHttpError("Cliente não encontrado");
    }

    const [withSameEmail, withSamePhone] = await Promise.all([
      this.clientRepository.findByEmail(dto.email),
      this.clientRepository.findByPhone(dto.phone),
    ]);

    if (withSameEmail && withSameEmail._id !== client._id) {
      throw new ConflictHttpError(
        "Outro cliente já possui esse email cadastrado"
      );
    }

    if (withSamePhone && withSamePhone._id !== client._id) {
      throw new ConflictHttpError(
        "Outro cliente já possui esse telefone cadastrado"
      );
    }

    client.email = dto.email;
    client.name = dto.name;
    client.phone = dto.phone;

    const validation = client.validate();

    if (!validation.valid) {
      throw new ValidationError(
        "Dados de cliente inválidos",
        validation.errors
      );
    }

    return this.clientRepository.update(id, client);
  }

  async findById(id: string) {
    const cached = await this.cacheService.get<Client>(`client:${id}`);

    if (cached) {
      console.log(`findById hitting cache for id:${id}`);
      return cached;
    }

    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundHttpError("Cliente não encontrado");
    }

    await this.cacheService.set(`client:${id}`, client, 30);

    return client;
  }

  async findPaginated(page: number, limit: number) {
    if (page <= 0) {
      throw new BadRequestHttpError(
        "O parâmetro 'page' da paginação deve ser maior que 0"
      );
    }

    if (limit > 100) {
      throw new BadRequestHttpError(
        "O parâmetro 'limit' da paginação não pode ser maior que 100"
      );
    }

    return this.clientRepository.findPaginated(page, limit);
  }

  async delete(id: string) {
    await this.clientRepository.delete(id);
  }
}
