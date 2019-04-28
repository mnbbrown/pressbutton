import { Handler } from "aws-lambda";
import { db, config } from "../db";
import { join } from "path";

export const handler: Handler = async () => {
  console.log(config);
  await db.migrate.latest({
    directory: join(process.cwd(), "migrations")
  });
};
