import { factory, migrate } from "./db";

(async () => {
  const db = factory({
    user: process.env.DB_USER || "mnbbrown",
    password: process.env.DB_PASS || ""
  });
  await migrate(db);
  process.exit(0);
})();
