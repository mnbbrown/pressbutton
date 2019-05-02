import { factory } from "../db";
import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();

const port = parseInt(process.env.PORT || "3000", 10);
const db = factory();
const profile = lambdaProfileAdapter(db);

const app = express();
