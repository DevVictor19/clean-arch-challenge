import { randomUUID } from "node:crypto";
import { Model, Schema } from "mongoose";

import { BaseEntity } from "../../domain/@shared/abstractions/entity";
import {
  BaseRepository,
  PaginatedResult,
} from "../../domain/@shared/abstractions/repository";

export const BaseSchema: Schema<BaseEntity> = new Schema({
  _id: { type: String, default: () => randomUUID() },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export abstract class BaseMongoRepository<E extends BaseEntity>
  implements BaseRepository<E>
{
  constructor(protected model: Model<E>) {}

  protected abstract toEntity(data: any): E;

  async save(model: E): Promise<E> {
    const m = new this.model(model);
    const saved = await m.save();
    return this.toEntity(saved);
  }

  async update(id: string, model: Partial<E>): Promise<E | null> {
    const updated = await this.model
      .findByIdAndUpdate(id, model, { new: true })
      .exec();
    return updated ? this.toEntity(updated) : null;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }

  async findById(id: string): Promise<E | null> {
    const found = await this.model.findById(id).exec();
    return found ? this.toEntity(found) : null;
  }

  async findAll(): Promise<E[]> {
    const results = await this.model.find().exec();
    return results.map(this.toEntity.bind(this));
  }

  async findPaginated(
    page: number,
    limit: number
  ): Promise<PaginatedResult<E>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model.find().skip(skip).limit(limit).exec(),
      this.model.countDocuments().exec(),
    ]);

    return {
      page,
      limit,
      total,
      results: data.length,
      data: data.map(this.toEntity.bind(this)),
    };
  }
}
