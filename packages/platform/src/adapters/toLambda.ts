import { Handler, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { Context } from "./context";
import { Request, Response, HandlerFn, HttpResponse, NextFn } from "./types";

export const toLambdaPath = (path: string) => {
  const parts = path.split("/");
  const withCorrectParams = parts
    .map(part => {
      if (part.startsWith(":")) {
        return `{${part.slice(1)}}`;
      }
      return part;
    })
    .join("/");
  return withCorrectParams.startsWith("/")
    ? withCorrectParams.slice(1)
    : withCorrectParams;
};

export const toLambda = (...handlers: HandlerFn<any, any>[]): Handler => async (
  event: APIGatewayEvent
) => {
  return new Promise<APIGatewayProxyResult>(resolve => {
    const request: Request = {
      body: event.body,
      headers: event.headers,
      method: event.httpMethod,
      query: event.queryStringParameters || {},
      params: event.pathParameters || {},
      path: event.path
    };

    const response: Response = {
      send(response: HttpResponse<any>) {
        const { body, statusCode, headers } = response;
        resolve({
          statusCode: statusCode || 200,
          headers: {
            "Content-Type": "application/json",
            ...(headers || {})
          },
          body: JSON.stringify(body)
        });
      }
    };

    const ctx: Context = {
      account: event.requestContext.identity.user
    };

    let current = 0;
    const next: NextFn = async () => {
      const nextHandler = handlers[current++];
      if (nextHandler) {
        await nextHandler(ctx, request, response, next);
      }
    };
    next();
  });
};
