import { name, tags } from "./utils";
import * as aws from "@pulumi/aws";
import { vpc, privateSubnets } from "./vpc";
import { securityGroup as bastionSecurityGroup } from "./bastion";
import { securityGroup as lambdaSecurityGroup, createLambda } from "./lambdas";
import { db_pass } from "../../../../secrets/dev.json";
import { factory, ensureDB } from "../db";

const privateSubnetGroup = new aws.rds.SubnetGroup(
  name("private-subnet-group"),
  {
    name: name("private-subnet-group"),
    subnetIds: privateSubnets.map(v => v.id),
    tags: tags("private-subnet-group")
  }
);

export const rdsSecurityGroup = new aws.ec2.SecurityGroup(
  name("rds-security-group"),
  {
    description: name("rds-security-group"),
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
        fromPort: 5432,
        protocol: "tcp",
        securityGroups: [lambdaSecurityGroup.id, bastionSecurityGroup.id],
        toPort: 5432
      }
    ],
    name: name("rds-security-group"),
    tags: tags("rds-security-group"),
    vpcId: vpc.id
  }
);

export const rds = new aws.rds.Instance(name("rds"), {
  allocatedStorage: 20,
  engine: "postgres",
  engineVersion: "11.2",
  instanceClass: "db.t2.micro",
  name: name("rds").replace(/-/g, ""),
  username: "root",
  password: db_pass,
  publiclyAccessible: false,
  storageType: "gp2",
  tags: tags("rds"),
  dbSubnetGroupName: privateSubnetGroup.name,
  vpcSecurityGroupIds: [rdsSecurityGroup.id]
});

export const migrationLambda = createLambda(
  "migrate",
  () => {
    return async () => {
      // Ensure DB exists
      const params = {
        user: rds.username.get(),
        password: rds.password.get(),
        host: rds.address.get()
      };
      await ensureDB(params);

      // Run migrations
      const db = factory(params);
      await db.migrate.latest({
        directory: "migrations"
      });
    };
  },
  {
    codePathOptions: {
      extraIncludePaths: ["migrations"]
    }
  }
);
