import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import { environment } from "./src/infrastructure/variables";
import { name } from "./src/infrastructure/utils";
import { rds } from "./src/infrastructure/rds";
import { pool } from "./src/infrastructure/cognito";
import { createLambda } from "./src/infrastructure/lambdas";
import { routes as profileRoutes } from "./src/routes/profile";
import { getStatus } from "./src/routes/status";
import { toLambdaPath, toLambda } from "./src/adapters/toLambda";
import { convertContext, createRoute } from "./src/infrastructure/api";
import { factory } from "./src/db";

const routes = [...profileRoutes, getStatus].map(route => {
  const lambda = createLambda(route.name, () => {
    const config = {
      db: factory({
        host: rds.address.get(),
        user: rds.username.get(),
        password: rds.password.get()
      })
    };
    return convertContext(toLambda(...route.handler(config)));
  });

  return createRoute(
    toLambdaPath(route.path),
    route.method,
    lambda,
    route.isPublic
  );
});

const api = new awsx.apigateway.API(name("api"), {
  routes
});

// Waiting on my PR to be merged: https://github.com/pulumi/pulumi-awsx/pull/262
routes.map(route => {
  const { method, path, eventHandler } = route;
  const methodAndPath = `${method === "ANY" ? "*" : method}/${path}`;
  return eventHandler.name.apply(
    eventHandlerName =>
      new aws.lambda.Permission(name(eventHandlerName), {
        action: "lambda:invokeFunction",
        function: eventHandler,
        principal: "apigateway.amazonaws.com",
        sourceArn: pulumi.interpolate`${
          api.deployment.executionArn
        }*/${methodAndPath}`
      })
  );
});

const apiDomainName = new aws.apigateway.DomainName(name("api-domain-name"), {
  regionalCertificateArn:
    "arn:aws:acm:eu-west-2:582259378644:certificate/b2a55f41-ee05-4645-9b38-9441a534cf3b",
  endpointConfiguration: {
    types: "REGIONAL"
  },
  domainName:
    environment === "prod"
      ? "api.pushbutton.dev"
      : `${environment}-api.pushbutton.dev`
});

new aws.apigateway.BasePathMapping(name("base-path-mapping"), {
  restApi: api.restAPI,
  domainName: apiDomainName.domainName,
  stageName: api.stage.stageName
});

new aws.route53.Record(name("api-domain-name"), {
  aliases: [
    {
      evaluateTargetHealth: true,
      name: apiDomainName.regionalDomainName,
      zoneId: apiDomainName.regionalZoneId
    }
  ],
  name: apiDomainName.domainName,
  type: "A",
  zoneId: "Z25FRYXD8P830Q"
});

export const API_ENDPOINT = apiDomainName.domainName;
export const COGNITO_POOL_ARN = pool.arn;
export const COGNITO_POOL_ENDPOINT = pool.endpoint;
