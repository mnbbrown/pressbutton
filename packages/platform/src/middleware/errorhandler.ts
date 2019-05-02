import { HttpError, respond } from "../utils/http";
import { Middleware } from "middy";

export const errorHandler: Middleware<void> = () => {
  return {
    onError: (handler, next) => {
      if (handler.error) {
        if (handler.error instanceof HttpError) {
          handler.response = respond(
            {
              message: handler.error.message,
              statusCode: handler.error.statusCode
            },
            handler.error.statusCode
          );
          next();
          return;
        }
        console.error(handler.error.stack || handler.error);
        handler.response = respond(
          {
            message: "Internal Server Error",
            statusCode: 500
          },
          500
        );
      }
      next();
      return;
    }
  };
};
