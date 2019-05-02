import { IDatabaseParams, migrate, ensureDB, factory } from "../db";
import * as dotenv from "dotenv";

(async () => {
  try {
    await dotenv.config();
    const params: Partial<IDatabaseParams> = {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST
    };
    await ensureDB(params);
    const db = factory(params);
    await migrate(db);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();
