import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import {
  azs,
  vpcCidr,
  privateSubnetCidrs,
  publicSubnetCidrs
} from "./variables";
import { name, tags } from "./utils";

export const vpc = new aws.ec2.Vpc(name("vpc"), {
  cidrBlock: vpcCidr,
  enableDnsHostnames: true,
  tags: tags("vpc")
});

const publicInternetGateway = new aws.ec2.InternetGateway(
  name("public-internet-gateway"),
  {
    tags: tags("public-internet-gateway"),
    vpcId: vpc.id
  }
);

// Private subnets
export const privateSubnets: aws.ec2.Subnet[] = azs.map(
  (az, i) =>
    new aws.ec2.Subnet(name(`${az}-private-subnet`), {
      availabilityZone: az,
      cidrBlock: privateSubnetCidrs[i],
      tags: tags(`${az}-private-subnet`),
      vpcId: vpc.id
    })
);

const natEip = new aws.ec2.Eip(name("nat-eip"), {
  tags: tags("nat-eip"),
  vpc: true
});

const natGateway = new aws.ec2.NatGateway(name("nat-gateway"), {
  allocationId: natEip.id,
  subnetId: privateSubnets[0].id,
  tags: tags("nat-gateway")
});

const privateRouteTable = new aws.ec2.RouteTable(name("private-route-table"), {
  tags: tags("private-route-table"),
  vpcId: vpc.id
});

const natGatewayRoute = new aws.ec2.Route(name("nat-gateway"), {
  destinationCidrBlock: "0.0.0.0/0",
  natGatewayId: natGateway.id,
  routeTableId: privateRouteTable.id
});

pulumi.all(privateSubnets.map(subnet => subnet.id)).apply(subnetIds =>
  subnetIds.map(
    subnetId =>
      new aws.ec2.RouteTableAssociation(`private-${subnetId}`, {
        routeTableId: privateRouteTable.id,
        subnetId: subnetId
      })
  )
);

// Public subnets
const publicRouteTable = new aws.ec2.RouteTable(name("public-route-table"), {
  tags: tags("public-route-table"),
  vpcId: vpc.id
});

const publicInternetGatewayRoute = new aws.ec2.Route(
  name("public-internet-gateway"),
  {
    destinationCidrBlock: "0.0.0.0/0",
    gatewayId: publicInternetGateway.id,
    routeTableId: publicRouteTable.id
  }
);

export const publicSubnets: aws.ec2.Subnet[] = azs.map(
  (az, i) =>
    new aws.ec2.Subnet(name(`${az}-public-subnet`), {
      availabilityZone: az,
      cidrBlock: publicSubnetCidrs[i],
      tags: tags(`${az}-public-subnet`),
      vpcId: vpc.id
    })
);

pulumi.all(publicSubnets.map(subnet => subnet.id)).apply(subnetIds =>
  subnetIds.map(
    subnetId =>
      new aws.ec2.RouteTableAssociation(`public-${subnetId}`, {
        routeTableId: publicRouteTable.id,
        subnetId: subnetId
      })
  )
);
