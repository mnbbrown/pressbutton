import { IDestination } from ".";
import { SES } from "aws-sdk";

type TAddresses = string | string[];

interface IEmailDestinationConfig {
  to: TAddresses;
  cc?: TAddresses;
  bcc?: TAddresses;
  subject: string;
  body: string;
}

export class EmailDestination implements IDestination<IEmailDestinationConfig> {
  private ses: SES;
  public constructor() {
    this.ses = new SES();
  }

  private async send(options: IEmailDestinationConfig): Promise<void> {
    await this.ses
      .sendEmail({
        Source: process.env.SOURCE_EMAIL,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
          BccAddresses:
            options &&
            options.bcc &&
            (Array.isArray(options.bcc) ? options.bcc : [options.bcc]),
          CcAddresses:
            options &&
            options.cc &&
            (Array.isArray(options.cc) ? options.cc : [options.cc])
        },
        Message: {
          Subject: {
            Data: options.subject
          },
          Body: {
            Text: {
              Data: options.body
            }
          }
        }
      })
      .promise();
  }

  public async execute(config: IEmailDestinationConfig): Promise<void> {
    console.log(config.to, config.body);
    //
  }
}
