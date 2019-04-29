import { Context, APIGatewayEvent, Handler } from "aws-lambda";
import { respond } from "../utils/http";
import { middleware } from "../middleware";
import { AccountRepository } from "../repositories/AccountRepository";

const accountRepository = new AccountRepository();

export const getProfileByUsername: Handler = async (
  event: APIGatewayEvent,
  ctx: Context
) => {
  ctx.callbackWaitsForEmptyEventLoop = false;
  const { username } = event.pathParameters;
  const profile = await accountRepository.getByUsername(username);
  return respond(profile);
};

export const handler = middleware(getProfileByUsername);
