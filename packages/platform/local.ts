import "reflect-metadata";
import { api } from "./src/routes/api";
import { toExpress } from "@pressbutton/engine/adapters/express";
import dotenv from "dotenv";

dotenv.config();
const app = toExpress(api);
app.listen(3000);
