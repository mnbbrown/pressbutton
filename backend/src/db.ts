import knex from "knex";
import knexConfig from "../knexfile";
import { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } from "./config";

const config = Object.assign(
  {},
  knexConfig[process.env.NODE_ENV || "development"],
  {
    connection: {
      host: DB_HOST || "127.0.0.1",
      port: parseInt(DB_PORT || "5432", 10),
      database: DB_NAME || "pressbutton",
      user: DB_USER,
      password: DB_PASS
    }
  }
);
export const db = knex(config);
