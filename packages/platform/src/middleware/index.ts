import { Handler } from "aws-lambda";
import middy from "middy";
import { errorHandler } from "./errorhandler";
import { doNotWaitForEmptyEventLoop } from "middy/middlewares";

export const middleware = (handler: Handler) =>
  middy(handler)
    .use(doNotWaitForEmptyEventLoop())
    .use(errorHandler());
