import { BaseRepository } from "../@shared/abstractions/repository";
import { Client } from "./entity";

export interface ClientRepository extends BaseRepository<Client> {
  findByEmail(email: string): Promise<Client | null>;
  findByPhone(phone: string): Promise<Client | null>;
}
