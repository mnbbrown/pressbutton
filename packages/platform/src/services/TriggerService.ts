import { ITriggerRepository } from "../repositories/TriggerRepository";
import { WebhookDestination } from "../destinations/webhook";
import { EmailDestination } from "../destinations/EmailDestination";
import { IDestinationsEnum, IDestination } from "../destinations";
import { HttpError } from "../utils/http";

export class TriggerService {
  private destinations: Record<IDestinationsEnum, IDestination<any>>;
  constructor(private repository: ITriggerRepository) {
    this.destinations = {
      [IDestinationsEnum.Webhook]: new WebhookDestination(),
      [IDestinationsEnum.Email]: new EmailDestination()
    };
  }
  public async invoke(token: string): Promise<void> {
    if (!token) {
      throw new HttpError(400, "Token is required");
    }
    const trigger = await this.repository.getByToken(token);
    if (!trigger) {
      throw new HttpError(400, "Token is invalid");
    }
    const { next, config } = trigger;
    await this.destinations[next].execute(config);
  }
}
