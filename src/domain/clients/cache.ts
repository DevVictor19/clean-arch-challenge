import { Cache } from "../@shared/abstractions/cache";
import { Client } from "./entity";

export class ClientCacheService {
  constructor(private readonly cache: Cache) {}

  async setById(id: string, client: Client) {
    await this.cache.set(`client:id:${id}`, client);
  }

  async getById(id: string) {
    return this.cache.get<Client>(`client:id:${id}`);
  }

  async setByEmail(email: string, client: Client) {
    await this.cache.set(`client:email:${email}`, client);
  }

  async getByEmail(email: string) {
    return this.cache.get<Client>(`client:email:${email}`);
  }

  async setByPhone(phone: string, client: Client) {
    await this.cache.set(`client:phone:${phone}`, client);
  }

  async getByPhone(phone: string) {
    return this.cache.get<Client>(`client:phone:${phone}`);
  }
}
