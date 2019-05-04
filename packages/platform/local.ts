import { createAPI } from "./src/routes/api";
import { toExpress } from "./src/engine/adapters/express";
import dotenv from "dotenv";

dotenv.config();
const api = createAPI();
const app = toExpress(api);
app.listen(3000);
