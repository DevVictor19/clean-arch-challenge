import { model, Schema } from "mongoose";
import { randomUUID } from "node:crypto";

import { Client } from "../../domain/clients/entity";
import { ClientRepository } from "../../domain/clients/repository";
import { BaseMongoRepository } from "./repository";

const ClientSchema: Schema = new Schema<Client>({
  _id: { type: String, default: () => randomUUID() },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
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
}
