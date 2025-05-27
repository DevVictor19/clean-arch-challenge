import amqp from "amqplib";
import { Queue } from "../../domain/@shared/abstractions/queue";
import { getRabbitMQConnection } from "./connection";

export class RabbitMQueue implements Queue {
  private channel: amqp.Channel;

  constructor() {
    this.channel = getRabbitMQConnection();
  }

  async publish(queue: string, message: any): Promise<void> {
    await this.channel.assertQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue "${queue}"`);
  }

  async consume(
    queue: string,
    onMessage: (msg: any) => Promise<void>
  ): Promise<void> {
    await this.channel.assertQueue(queue);
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          await onMessage(JSON.parse(msg.content.toString()));
          this.channel.ack(msg);
        } catch (error) {
          // aqui podemos controlar o retry...
          console.error("consume error: ", error);
        }
      }
    });
    console.log(`Consuming messages from queue "${queue}"`);
  }
}
