import "dotenv/config";

interface EnvConfigs {
  serverPort: number;
  mongo: MongoConfigs;
  redis: RedisConfigs;
}

interface MongoConfigs {
  uri: string;
  dbName: string;
}

interface RedisConfigs {
  url: string;
}

let envConfigs: EnvConfigs;

export function loadEnv() {
  envConfigs = {
    serverPort: getNumber("SERVER_PORT", 3000),
    mongo: {
      uri: getString("MONGO_URL", "mongodb://admin:admin@mongo:27017"),
      dbName: getString("MONGO_DATABASE", "clients-api"),
    },
    redis: {
      url: getString("REDIS_URL", "redis://redis:6379"),
    },
  };
}

export function getEnv(): Readonly<EnvConfigs> {
  if (!envConfigs) {
    throw new Error("Calling getEnv before initializing envConfigs");
  }
  return envConfigs;
}

function getString(value: string, fallback: string): string {
  const val = process.env[value];
  if (!val) {
    return fallback;
  }
  return val;
}

function getNumber(value: string, fallback: number): number {
  const val = Number(process.env[value]);
  if (!val) {
    return fallback;
  }
  return val;
}
