import { Request, Response, HandlerFn, HttpResponse, NextFn } from "./types";
import * as express from "express";

export const toExpress = (
  ...handlers: HandlerFn<any, any>[]
): express.RequestHandler => async (
  req: express.Request,
  expressRes: express.Response,
  expressNext: express.NextFunction
) => {
  try {
    const request: Request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query || {},
      params: req.params || {},
      path: req.path
    };

    const response: Response = {
      send(response: HttpResponse<any>) {
        const { body, statusCode, headers } = response;
        if (headers) {
          Object.keys(headers).forEach(header =>
            expressRes.setHeader(header, headers[header])
          );
        }
        expressRes.status(statusCode || 200).json(body);
      }
    };

    let current = 0;
    const next: NextFn = async () => {
      const nextHandler = handlers[current++];
      if (nextHandler) {
        await nextHandler(request, response, next);
      }
    };
    next();
  } catch (e) {
    expressNext(e);
  }
};
