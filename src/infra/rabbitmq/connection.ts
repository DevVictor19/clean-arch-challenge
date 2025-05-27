import amqp from "amqplib";
import { getEnv } from "../env/env-config";

let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    console.log("Attempting connection to rabbitmq...");
    const connection = await amqp.connect(getEnv().rabbitmq.url);
    channel = await connection.createChannel();
    console.log("RabbitMQ connected...");
  } catch (error) {
    console.error("Failed to connect to rabbitmq", error);
  }
}

export function getRabbitMQConnection() {
  if (!channel) {
    throw new Error("RabbitMQ connection not initialized");
  }

  return channel;
}

export async function disconnectRabbitMQ() {
  if (channel) {
    await channel.close();
  }
}
