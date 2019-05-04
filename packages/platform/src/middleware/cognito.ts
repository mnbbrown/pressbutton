import { HandlerFn, Request, Response, NextFn } from "../adapters/types";
import { HttpError } from "../utils/http";

export const error: HandlerFn = async (
  _: Request,
  res: Response<{ message: string; stack?: string }>,
  next: NextFn
) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      res.send({
        statusCode: e.statusCode,
        body: {
          message: e.message,
          stack: e.stack
        }
      });
      return;
    }
    console.error(e);
    res.send({
      statusCode: 500,
      body: { message: e.message }
    });
  }
};
