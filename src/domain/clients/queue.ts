import { Queue } from "../@shared/abstractions/queue";
import { InternalServerHttpError } from "../@shared/errors/http";
import { Client } from "./entity";

export class ClientQueueService {
  private clientsEmailQueue = "clients-email-queue";

  constructor(private readonly queue: Queue) {
    this.queue.consume(
      this.clientsEmailQueue,
      this.handleSendWelcomeEmail.bind(this)
    );
  }

  async sendWelcomeEmail(client: Client) {
    try {
      await this.queue.publish(this.clientsEmailQueue, client);
    } catch (error) {
      console.error("sendWelcomeEmail error:", error);
      throw new InternalServerHttpError(
        "Não foi possível enviar email de boas vindas"
      );
    }
  }

  private async handleSendWelcomeEmail(msg: Client) {
    console.log("Implementar método de envio de emails....");
    console.log("Cliente: ", msg);
  }
}
