import { vpc, publicSubnets, privateSubnets } from "./vpc";
import { rds } from "./rds";
import { securityGroup as bastionSecurityGroup } from "./bastion";
import { securityGroup as lambdaSecurityGroup } from "./lambdas";
import { pool } from "./cognito";

// VPC
export const privateSubnetId = privateSubnets.map(v => v.id);
export const publicSubnetIds = publicSubnets.map(v => v.id);
export const vpcId = vpc.id;

// RDS
export const rdsHost = rds.address;
export const rdsUser = rds.username;

// Bastion
export const bastionSecurityGroupId = bastionSecurityGroup.id;

// Lambdas
export const lambdaSecurityGroupId = lambdaSecurityGroup.id;

// Cognito
export const cognitoArn = pool.arn;
export const cognitoEndpoint = pool.endpoint;
