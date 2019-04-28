import knex from "knex";
import { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } from "./config";

export const config = {
  client: "postgresql",
  connection: {
    host: DB_HOST || "127.0.0.1",
    port: parseInt(DB_PORT || "5432", 10),
    database: DB_NAME || "pressbutton",
    user: DB_USER,
    password: DB_PASS
  },
  pool: {
    min: 2,
    max: 10
  },
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: "knex_migrations"
  }
};
export const db = knex(config);
