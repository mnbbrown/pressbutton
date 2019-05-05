import {
  APIGatewayEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from "aws-lambda";
import { Response, Route, Request } from "../types";

export const toLambdaPath = (path: string) => {
  const parts = path.split("/");
  return parts
    .map(part => {
      if (part.startsWith(":")) {
        return `{${part.slice(1)}}`;
      }
      return part;
    })
    .join("/");
};

export const toLambdaHandler = (route: Route<any>): APIGatewayProxyHandler => {
  const { handler } = route;
  return async (event: APIGatewayEvent) => {
    return new Promise<APIGatewayProxyResult>(resolve => {
      const request: Request<any> = {
        method: event.httpMethod,
        body: event.body,
        headers: event.headers,
        path: event.path,
        params: event.pathParameters || {},
        query: event.queryStringParameters || {}
      };

      const headers: {
        [key: string]: string | number;
      } = {};
      const response: Response = {
        setHeader: (name, value) => {
          headers[name] = Array.isArray(value) ? value.join(" ") : value;
        },
        send: (body, statusCode) => {
          response.status = statusCode;
          resolve({
            statusCode: statusCode || 200,
            headers,
            body: typeof body !== "string" ? JSON.stringify(body) : body
          });
        }
      };

      const context = {};
      handler({ res: response, req: request, context }, async () => {});
    });
  };
};
