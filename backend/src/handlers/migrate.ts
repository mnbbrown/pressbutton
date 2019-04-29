import { Handler } from "aws-lambda";
import { db } from "../db";
import { join } from "path";

export const handler: Handler = async () => {
  try {
    await db.migrate.latest({
      directory: join(process.cwd(), "migrations")
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
