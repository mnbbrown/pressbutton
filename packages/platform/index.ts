import "reflect-metadata";
import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import { environment } from "./src/infrastructure/variables";
import { name } from "./src/infrastructure/utils";
import { rds } from "./src/infrastructure/rds";
import { frontendClient, pool } from "./src/infrastructure/cognito";
import { createLambda } from "./src/infrastructure/lambdas";
import { createRoute } from "./src/infrastructure/api";
import { routes } from "./src/routes/api";
import { toLambdaPath } from "./src/engine/adapters/lambda";

const apiRoutes = routes.map(route => {
  const lambda = createLambda(route.name, "src/handlers/api.handler", {
    environment: {
      variables: {
        DB_USER: pulumi.interpolate`${rds.username}`,
        DB_PASS: pulumi.interpolate`${rds.password}`,
        DB_HOST: pulumi.interpolate`${rds.address}`
      }
    }
  });
  return createRoute(
    toLambdaPath(route.path),
    route.method as awsx.apigateway.Method,
    lambda,
    true
  );
});

const api = new awsx.apigateway.API(name("api"), {
  routes: apiRoutes
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
export const COGNITO_POOL_ID = pool.id;
export const COGNITO_POOL_CLIENT_ID = frontendClient.id;
