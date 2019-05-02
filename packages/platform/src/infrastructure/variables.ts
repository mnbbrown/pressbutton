import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();
export const azs: string[] = ["eu-west-2a", "eu-west-2b", "eu-west-2c"];
export const environment = config.get("environment") || "dev";
export const project = config.get("project") || "pressbutton";
export const publicSubnetCidrs = config.get("publicSubnetCidrs") || [
  "10.0.0.0/24",
  "10.0.1.0/24",
  "10.0.2.0/24"
];
export const vpcCidr = config.get("vpcCidr") || "10.0.0.0/16";

export const privateSubnetCidrs = config.get("privateSubnetCidrs") || [
  "10.0.128.0/24",
  "10.0.129.0/24",
  "10.0.130.0/24"
];
