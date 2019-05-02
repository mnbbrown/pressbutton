import * as aws from "@pulumi/aws";
import { name, tags } from "./utils";

export const pool = new aws.cognito.UserPool(name("pool"), {
  name: name("pool"),
  tags: tags("pool")
});
export const frontendClient = new aws.cognito.UserPoolClient(
  name("frontend-client"),
  {
    userPoolId: pool.id
  }
);
