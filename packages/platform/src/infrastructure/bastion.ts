import { vpc } from "./vpc";
import { environment, project } from "./variables";
import * as aws from "@pulumi/aws";
import { name } from "./utils";

export const securityGroup = new aws.ec2.SecurityGroup(
  name("bastion-security-group"),
  {
    description: "bastion security group",
    egress: [
      {
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 0,
        protocol: "-1",
        toPort: 0
      }
    ],
    ingress: [
      {
        cidrBlocks: ["0.0.0.0/0"],
        fromPort: 22,
        protocol: "tcp",
        toPort: 22
      }
    ],
    name: name("bastion"),
    tags: {
      Environment: environment,
      Name: name("bastion"),
      Project: project
    },
    vpcId: vpc.id
  }
);
