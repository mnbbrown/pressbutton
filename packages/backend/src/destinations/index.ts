import { IEmailDestinationConfig } from "./EmailDestination";
import { IWebhookConfig } from "./webhook";

export interface IDestination<T> {
  execute(config: T): Promise<void>;
}

export type DestinationConfigs = IEmailDestinationConfig | IWebhookConfig;
