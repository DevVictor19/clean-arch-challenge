import "dotenv/config";

interface EnvConfigs {
  serverPort: number;
}

let envConfigs: EnvConfigs;

export function loadEnv() {
  envConfigs = {
    serverPort: getNumber("SERVER_PORT", 3000),
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
