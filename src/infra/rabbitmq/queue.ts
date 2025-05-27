import { Queue } from "../../domain/@shared/abstractions/queue";
import { getRabbitMQChannel } from "./connection";

export class RabbitMQueue implements Queue {
  async publish(queue: string, message: any): Promise<void> {
    try {
      const channel = await getRabbitMQChannel();
      channel.assertQueue(queue);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
      console.log(`Message sent to queue "${queue}"`);
    } catch (error) {
      console.error("publish error: ", error);
      throw error;
    }
  }

  async consume(
    queue: string,
    onMessage: (msg: any) => Promise<void>
  ): Promise<void> {
    try {
      const channel = await getRabbitMQChannel();
      channel.assertQueue(queue);
      channel.consume(queue, async (msg) => {
        if (msg) {
          try {
            await onMessage(JSON.parse(msg.content.toString()));
            channel.ack(msg);
          } catch (error) {
            console.error("consume error: ", error);
          }
        }
      });
      console.log(`Consuming messages from queue "${queue}"`);
    } catch (error) {
      console.error("consume error: ", error);
    }
  }
}
