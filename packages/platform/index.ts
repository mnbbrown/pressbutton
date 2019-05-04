import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";
import { environment } from "./src/infrastructure/variables";
import { name } from "./src/infrastructure/utils";
import { rds } from "./src/infrastructure/rds";
import { frontendClient, pool } from "./src/infrastructure/cognito";
import { createLambda } from "./src/infrastructure/lambdas";
import { convertContext, createRoute } from "./src/infrastructure/api";
import { createAPI } from "./src/routes/api";
import { toLambdaPath, toLambdaHandler } from "./src/engine/adapters/lambda";

const routes = pulumi
  .all([rds.address, rds.username, rds.password])
  .apply(([address, username, password]) =>
    createAPI({
      host: address,
      user: username,
      password: password
    }).routes.map(route => {
      const lambda = createLambda(route.name, () => {
        return convertContext(toLambdaHandler(route));
      });
      return createRoute(
        toLambdaPath(route.path),
        route.method as awsx.apigateway.Method,
        lambda,
        true
      );
    })
  );

export const outputs = routes.apply(routes => {
  const api = new awsx.apigateway.API(name("api"), {
    routes
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

  const API_ENDPOINT = apiDomainName.domainName;
  const COGNITO_POOL_ID = pool.id;
  const COGNITO_POOL_CLIENT_ID = frontendClient.id;
  return { API_ENDPOINT, COGNITO_POOL_CLIENT_ID, COGNITO_POOL_ID };
});
