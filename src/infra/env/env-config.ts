import "dotenv/config";

interface EnvConfigs {
  serverPort: number;
  mongoURI: string;
}

let envConfigs: EnvConfigs;

export function loadEnv() {
  envConfigs = {
    serverPort: getNumber("SERVER_PORT", 3000),
    mongoURI: getString("MONGO_URL", "mongodb://admin:admin@mongo:27017"),
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
