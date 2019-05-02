import * as pulumi from "@pulumi/pulumi";
import { migrate as dbMigrate, factory } from "../db";
import { rds } from "../infrastructure/rds";

export const migrate = async () => {
  return pulumi
    .all([rds.domain, rds.username, rds.password])
    .apply(async outputs => {
      const [host, user, password] = outputs;
      const db = factory({
        host,
        user,
        password
      });
      await dbMigrate(db);
    });
};
