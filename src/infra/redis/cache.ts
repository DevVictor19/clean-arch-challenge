import { RedisClientType } from "redis";
import { CacheService } from "../../domain/@shared/abstractions/services/cache";
import { getRedisClient } from "./connection";

export class RedisCacheService implements CacheService {
  private client: RedisClientType;

  constructor() {
    this.client = getRedisClient();
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
  }
}
