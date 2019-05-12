import { migrate, ensureDB, factory } from "../db";
import * as dotenv from "dotenv";

(async () => {
  try {
    await dotenv.config();
    await ensureDB({});
    const db = factory();
    await migrate(db);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
  process.exit(0);
})();
