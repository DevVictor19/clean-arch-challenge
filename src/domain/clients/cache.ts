import { CacheService } from "../@shared/abstractions/services/cache";
import { Client } from "./entity";

export class ClientCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async setById(id: string, client: Client) {
    await this.cacheService.set(`client:id:${id}`, client);
  }

  async getById(id: string) {
    return this.cacheService.get<Client>(`client:id:${id}`);
  }

  async setByEmail(email: string, client: Client) {
    await this.cacheService.set(`client:email:${email}`, client);
  }

  async getByEmail(email: string) {
    return this.cacheService.get<Client>(`client:email:${email}`);
  }

  async setByPhone(phone: string, client: Client) {
    await this.cacheService.set(`client:phone:${phone}`, client);
  }

  async getByPhone(phone: string) {
    return this.cacheService.get<Client>(`client:phone:${phone}`);
  }
}
