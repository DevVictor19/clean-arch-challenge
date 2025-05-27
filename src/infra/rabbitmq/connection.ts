import amqp from "amqplib";
import { getEnv } from "../env/env-config";

let connection: amqp.ChannelModel | null = null;

// podemos ter mais channels depois...
let channel: amqp.Channel | null = null;

export async function connectRabbitMQ(
  retries: number = 5,
  delay: number = 3000
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Connecting to RabbitMQ...`);
      connection = await amqp.connect(getEnv().rabbitmq.url);
      console.log("RabbitMQ connected.");
      return connection;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);

      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("All retries exhausted. Could not connect to RabbitMQ.");
        throw error;
      }
    }
  }
}

export async function getRabbitMQChannel() {
  if (!connection) {
    throw new Error("RabbitMQ connection not initialized");
  }

  if (!channel) {
    channel = await connection.createChannel();
  }

  return channel;
}

export async function disconnectRabbitMQ() {
  if (connection) {
    await connection.close();
  }

  if (channel) {
    await channel.close();
  }
}
