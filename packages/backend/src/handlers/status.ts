import { Context, APIGatewayEvent, Handler } from "aws-lambda";
import { respond } from "../utils/http";
import { middleware } from "../middleware";
import { AccountRepository } from "../repositories/AccountRepository";

const accountRepository = new AccountRepository();

export const status: Handler = async (_: APIGatewayEvent, ctx: Context) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  const count = await accountRepository.count();
  return respond({ count });
};

export const handler = middleware(status);
