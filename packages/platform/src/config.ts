import Knex from "knex";
export interface Config {
  db: Knex;
}

export const SOURCE_EMAIL = process.env.SOURCE_EMAIL || "test@pressbutton.co";
