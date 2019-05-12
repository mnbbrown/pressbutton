import Knex from "knex";
import * as pg from "pg";
import escape from "pg-escape";
import { join } from "path";

export const TDB = Symbol.for("DB");

export interface IDatabaseParams {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export const applyDefaults = (
  params: Partial<IDatabaseParams>
): IDatabaseParams =>
  Object.assign(
    {},
    {
      host: process.env.DB_HOST || "127.0.0.1",
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || "pressbutton",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "password"
    },
    params
  );

export const factory = (params?: Partial<IDatabaseParams>) => {
  const connection = applyDefaults(params || {});
  const config = {
    client: "postgresql",
    connection,
    pool: {
      min: 2,
      max: 10
    },
    acquireConnectionTimeout: 10000,
    migrations: {
      tableName: "knex_migrations"
    }
  };

  return Knex(config);
};

export const migrate = async (db: Knex) => {
  try {
    await db.migrate.latest({
      directory: join(process.cwd(), "migrations")
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export const ensureDB = async (overrides: Partial<IDatabaseParams>) => {
  try {
    const params = applyDefaults(overrides);
    const client = await new Promise<pg.Client>((resolve, reject) => {
      const dsn = `postgres://${encodeURIComponent(params.user)}${
        params.password ? ":" + encodeURIComponent(params.password) : ""
      }@${params.host}:${params.port || 5432}/postgres`;
      console.log("Connecting to database:", dsn);
      const pgClient = new pg.Client(dsn);
      pgClient.connect(err => {
        if (err) {
          reject(err);
        }
        resolve(pgClient);
      });
    });
    const query = escape(
      "CREATE DATABASE %I OWNER = %I ENCODING = 'UTF-8' TEMPLATE template1",
      params.database,
      params.user
    );
    console.log(query);
    await new Promise((resolve, reject) => {
      client.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  } catch (e) {
    if (e.code === "42P04") {
      return;
    }
    throw e;
  }
};
