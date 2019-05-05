import { IDatabaseParams } from "./db";

export const TConfig = Symbol.for("Config");
export interface Config extends IDatabaseParams {
  random?: boolean; //
}

export const SOURCE_EMAIL = process.env.SOURCE_EMAIL || "test@pressbutton.co";
