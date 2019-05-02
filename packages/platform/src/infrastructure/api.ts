import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { pool } from "./cognito";
import { Handler, Context } from "aws-lambda";

export const convertContext = (
  handler: Handler
): aws.lambda.Callback<awsx.apigateway.Request, awsx.apigateway.Response> => {
  const pulumiHandler: aws.lambda.EventHandler<
    awsx.apigateway.Request,
    awsx.apigateway.Response
  > = (event, context, callback) => {
    const lambdaContext: Context = {
      done() {
        throw new Error("done is just a placeholder ");
      },
      fail() {
        throw new Error("fail is just a placeholder ");
      },
      succeed() {
        throw new Error("succeed is just a placeholder ");
      },
      ...context,
      getRemainingTimeInMillis: () =>
        parseInt(context.getRemainingTimeInMillis(), 10),
      memoryLimitInMB: parseInt(context.memoryLimitInMB, 10)
    };
    return handler(event, lambdaContext, callback);
  };
  return pulumiHandler;
};

export const createRoute = (
  path: string,
  method: awsx.apigateway.Method,
  eventHandler: aws.lambda.CallbackFunction<
    awsx.apigateway.Request,
    awsx.apigateway.Response
  >,
  isPublic: boolean = false
) => ({
  path,
  method,
  eventHandler,
  authorizers: !isPublic
    ? awsx.apigateway.getCognitoAuthorizer({
        providerARNs: [pool]
      })
    : undefined
});
