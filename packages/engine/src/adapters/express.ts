import express from "express";
import { Route, Response, Request } from "../types";
import { API } from "../index";

export const toExpressHandler = (route: Route<any>): express.Handler => {
  const { handler } = route;
  return (req, res, next) => {
    const request: Request<any> = {
      method: req.method,
      body: req.body,
      headers: req.headers,
      path: req.path,
      params: req.params,
      query: req.query
    };
    const response: Response = {
      setHeader: res.setHeader,
      adapted: res,
      send: (body: string | object, statusCode: number = 200) => {
        response.status = statusCode;
        if (typeof body === "string") {
          res
            .status(statusCode)
            .send(body)
            .end();
        } else {
          res
            .status(statusCode)
            .json(body)
            .end();
        }
      }
    };
    handler({ req: request, res: response, context: {} }, async () => {
      next();
    });
  };
};

export const toExpress = (api: API<any>) => {
  const app = express();
  for (const route of api.routes) {
    const { method, path } = route;
    switch (method) {
      case "GET":
        app.get(path, toExpressHandler(route));
        break;
      default:
        app.use(toExpressHandler(route));
    }
  }
  return app;
};
