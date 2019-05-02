import express from "express";
import dotenv from "dotenv";
import { factory } from "./src/db";
import { routes as profileRoutes } from "./src/routes/profile";
import { toExpress } from "./src/adapters/toExpress";
import { Route } from "./src/adapters";

dotenv.config();
const db = factory();
const app = express();
const config = { db };

const applyRoutes = (routes: Route[]) =>
  routes.forEach(route => {
    switch (route.method) {
      case "GET": {
        app.get(route.path, toExpress(...route.handler(config)));
        break;
      }
      default: {
        app.use(toExpress(...route.handler(config)));
      }
    }
  });

applyRoutes(profileRoutes);
app.listen(3000);
