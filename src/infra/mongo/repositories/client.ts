import { model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

import { Client } from "../../../domain/clients/entity";
import { ClientRepository } from "../../../domain/clients/repository";
import { BaseMongoRepository } from "./repository";

const ClientSchema: Schema = new Schema<Client>({
  _id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const ClientModel = model<Client>("Client", ClientSchema);

export class MongoClientRepository
  extends BaseMongoRepository<Client>
  implements ClientRepository
{
  constructor() {
    super(ClientModel);
  }

  async findByEmail(email: string): Promise<Client | null> {
    const found = await this.model.findOne({ email });
    return found ? this.toEntity(found) : null;
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const found = await this.model.findOne({ phone });
    return found ? this.toEntity(found) : null;
  }

  protected toEntity(data: any): Client {
    return new Client({
      _id: data._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }
}
