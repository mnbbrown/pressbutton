import { API } from "@pressbutton/engine";
import { Middleware } from "@pressbutton/engine/types";
import { HttpError } from "../utils/http";
import { Container } from "inversify";
import {
  TAccountRepository,
  IAccountRepository
} from "../repositories/AccountRepository";
import { IProfileService, TProfileService } from "../services/ProfileService";
import { createContainer } from "../container";

interface Context {
  container: Container;
}

const errorHandler: Middleware<any> = async function({ res }, next) {
  try {
    await next();
  } catch (e) {
    if (e instanceof HttpError) {
      res.send(
        {
          message: e.message
        },
        e.statusCode || 200
      );
    } else {
      console.error(e);
      res.send(
        {
          message: "Internal Server Error"
        },
        500
      );
    }
  }
};

const container: Middleware<Context> = async function({ context }, next) {
  context.container = createContainer();
  await next();
};

const logging: Middleware<any> = async function({ req, res }, next) {
  const start = process.hrtime();
  await next();
  const end = process.hrtime(start);
  console.info(
    "%s %s %d %ds %dms",
    req.method,
    req.path,
    res.status,
    end[0],
    end[1] / 1000000
  );
};

const profileAPI = new API<Context>();
profileAPI.use({
  name: "getProfile",
  path: `/:username`,
  method: "GET",
  handler: async event => {
    const { res, req, context } = event;
    const profileService = context.container.get<IProfileService>(
      TProfileService
    );
    const { username } = req.params;
    const result = await profileService.getByUsername(username);
    res.send(result);
  }
});

export const statusAPI = new API<Context>();
statusAPI.use({
  name: "status",
  path: "",
  method: "GET",
  handler: async event => {
    const { res, context } = event;
    const repository = context.container.get<IAccountRepository>(
      TAccountRepository
    );
    const count = await repository.count();
    res.send({ count });
  }
});

export const api = new API<Context>();
api.use(container);
api.use(logging);
api.use(errorHandler);
api.mount("/profiles", profileAPI);
api.mount("/status", statusAPI);

export const routes = api.routes;
