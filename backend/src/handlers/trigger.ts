import { APIGatewayEvent, Handler } from "aws-lambda";
import { respond, HttpError } from "../utils/http";
import { middleware } from "../middleware";
import { TriggerRepository } from "../repositories/TriggerRepository";
import {
  EmailDestination,
  IEmailDestinationConfig
} from "../destinations/EmailDestination";
import { WebhookDestination, IWebhookConfig } from "../destinations/webhook";
import { DestinationConfigs } from "../destinations";

const triggerRepository = new TriggerRepository();

// Destinations
const emailDestination = new EmailDestination();
const webhookDestination = new WebhookDestination();

enum IDestinationsEnum {
  Email = "email",
  Webhook = "webhook"
}

const handleNext = async (
  next: string,
  config: DestinationConfigs
): Promise<void> => {
  switch (next) {
    case IDestinationsEnum.Email: {
      return emailDestination.execute(config as IEmailDestinationConfig);
    }
    case IDestinationsEnum.Webhook: {
      return webhookDestination.execute(config as IWebhookConfig);
    }
    default: {
      console.log("Unknown");
    }
  }
};

export const trigger: Handler = async (event: APIGatewayEvent) => {
  const qs = event.queryStringParameters || {};
  if (!qs.token) {
    throw new HttpError(400, "Token is required");
  }
  const trigger = await triggerRepository.getByToken(qs.token);
  if (!trigger) {
    throw new HttpError(404, "Token is invalid");
  }
  const { next, config } = trigger;
  await handleNext(next, config);
  return respond();
};

export const handler = middleware(trigger);
