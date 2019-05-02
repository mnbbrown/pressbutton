import * as aws from "@pulumi/aws";
import { name, tags } from "./utils";

export const pool = new aws.cognito.UserPool(name("pool"), {
  name: name("pool"),
  tags: tags("pool")
});
