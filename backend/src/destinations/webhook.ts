import axios from "axios";
import { IDestination } from ".";

interface IWebhookConfig {
  url: string;
  method: "GET" | "POST";
  body: object;
}

export class WebhookDestination implements IDestination<IWebhookConfig> {
  public async execute(config: IWebhookConfig): Promise<void> {
    const { url, method, body } = config;
    await axios.request({
      url,
      method,
      headers: {
        "Content-Type": "application/json"
      },
      data: body || { test: true }
    });
  }
}
