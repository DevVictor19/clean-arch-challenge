import { ClientRepository } from "./repository";

export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}
}
