import { createClient, RedisClientType } from "redis";
import { getEnv } from "../env/env-config";

let redisClient: RedisClientType | null = null;

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error("Calling getRedisClient before initializing connection");
  }

  return redisClient;
}

export async function connectRedis() {
  if (redisClient) {
    throw new Error("Redis already connected");
  }

  try {
    redisClient = createClient({
      url: getEnv().redis.url,
    });
    console.log("Attempting to connect to redis...");

    await redisClient.connect();

    console.log("Redis connected...");
  } catch (error) {
    console.error("Redis Connection Error", error);
  }
}

export function disconnectRedis() {
  if (redisClient) {
    redisClient.destroy();
  }
}
