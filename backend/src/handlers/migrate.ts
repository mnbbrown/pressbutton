import { Handler } from "aws-lambda";
import { db } from "../db";
import { join } from "path";

export const handler: Handler = async () => {
  await db.migrate.latest({
    directory: join(process.cwd(), "migrations")
  });
};
