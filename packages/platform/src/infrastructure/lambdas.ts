import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { HandlerFactory } from "@pulumi/aws/serverless";
import { name, tags } from "./utils";
import { vpc, publicSubnets } from "./vpc";
import { CallbackFunctionArgs } from "@pulumi/aws/lambda";

export const securityGroup = new aws.ec2.SecurityGroup(
  name("lambda-security-group"),
  {
    description: name("lambda-security-group"),
    egress: [
      {
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0
      }
    ],
    name: name("lambda-security-group"),
    tags: tags("lambda-security-group"),
    vpcId: vpc.id
  }
);

export const createLambda = (
  lambdaName: string,
  handlerFactory: HandlerFactory,
  params?: Partial<
    CallbackFunctionArgs<awsx.apigateway.Request, awsx.apigateway.Response>
  >
) =>
  new aws.lambda.CallbackFunction(name(lambdaName), {
    vpcConfig: {
      subnetIds: publicSubnets.map(subnet => subnet.id),
      securityGroupIds: [securityGroup.id]
    },
    policies: [
      aws.iam.AWSLambdaVPCAccessExecutionRole,
      aws.iam.AWSLambdaExecute
    ],
    callbackFactory: handlerFactory,
    ...(params || {})
  });
