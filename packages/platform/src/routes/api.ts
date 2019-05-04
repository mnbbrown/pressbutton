import { Container } from "inversify";
import "reflect-metadata";
import {
  AccountRepository,
  TAccountRepository,
  IAccountRepository
} from "../repositories/AccountRepository";
import {
  ProfileService,
  IProfileService,
  TProfileService
} from "../services/ProfileService";
import { API } from "../engine";
import Knex from "knex";
import { factory, IDatabaseParams } from "../db";
import { Middleware } from "../engine/types";
import { HttpError } from "../utils/http";
import { DB } from "../container";

interface Context {
  user: any;
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
      res.send(
        {
          message: "Internal Server Error"
        },
        500
      );
    }
  }
};

const logging: Middleware<any> = async function({ req, res }, next) {
  const start = process.hrtime();
  await next();
  const end = process.hrtime(start);
  console.info(
    "%s %d %ds %dms",
    req.method,
    res.status,
    end[0],
    end[1] / 1000000
  );
};

const createProfileAPI = (container: Container) => {
  const api = new API<Context>();
  api.use({
    name: "getProfile",
    path: `/:username`,
    method: "GET",
    handler: async event => {
      const profileService = container.get<IProfileService>(TProfileService);
      const { res, req } = event;
      const { username } = req.params;
      const result = await profileService.getByUsername(username);
      res.send(result);
    }
  });
  return api;
};

const createStatusAPI = (container: Container) => {
  const api = new API<Context>();
  api.use({
    name: "status",
    path: "",
    method: "GET",
    handler: async event => {
      const repository = container.get<IAccountRepository>(TAccountRepository);
      const { res } = event;
      const count = await repository.count();
      res.send({ count });
    }
  });
  return api;
};

interface Config extends IDatabaseParams {
  random?: boolean; //
}

export const createAPI = (config?: Partial<Config>) => {
  const container = new Container();
  container.bind<Knex>(DB).toFactory(() => factory(config));
  container.bind<IAccountRepository>(TAccountRepository).to(AccountRepository);
  container.bind<IProfileService>(TProfileService).to(ProfileService);

  const root = new API<Context>();
  root.use(logging);
  root.use(errorHandler);
  root.mount("/profiles", createProfileAPI(container));
  root.mount("/status", createStatusAPI(container));
  return root;
};
