import { IWebhookConfig } from "./webhook";

export enum IDestinationsEnum {
  Webhook = "webhook"
}

export interface IDestination<T> {
  execute(config: T): Promise<void>;
}

export type DestinationConfigs = IWebhookConfig;
