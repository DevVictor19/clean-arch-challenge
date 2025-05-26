import { BaseEntity } from "./entity";

export interface PaginatedResult<E extends BaseEntity> {
  page: number;
  limit: number;
  total: number;
  results: number;
  data: E[];
}

export interface BaseRepository<E extends BaseEntity> {
  save(model: E): Promise<E>;
  update(id: string, model: Partial<E>): Promise<E | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<E | null>;
  findAll(): Promise<E[]>;
  findPaginated(page: number, limit: number): Promise<PaginatedResult<E>>;
}
