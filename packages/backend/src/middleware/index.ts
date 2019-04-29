import { Handler } from "aws-lambda";
import { errorHandler } from "./errorhandler";
import middy from "middy";

export const middleware = (handler: Handler) =>
  middy(handler).use(errorHandler());
