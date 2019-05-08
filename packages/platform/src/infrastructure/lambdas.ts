import * as aws from "@pulumi/aws";
import { name, tags } from "./utils";
import { vpc, publicSubnets } from "./vpc";
import {
  WebpackFunctionArgs,
  WebpackFunction
} from "../components/WebpackFunction";

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
  handler: string,
  params?: Partial<WebpackFunctionArgs>
) =>
  new WebpackFunction(name(lambdaName), {
    vpcConfig: {
      subnetIds: publicSubnets.map(subnet => subnet.id),
      securityGroupIds: [securityGroup.id]
    },
    policies: [
      aws.iam.AWSLambdaVPCAccessExecutionRole,
      aws.iam.AWSLambdaExecute
    ],
    handler,
    ...(params || {})
  });
