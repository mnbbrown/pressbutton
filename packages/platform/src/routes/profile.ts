import {
  AccountRepository,
  IAccountRecord
} from "../repositories/AccountRepository";
import { ProfileService } from "../services/ProfileService";
import { Route, HandlerFn } from "../adapters";
import { Config } from "../config";

const getService = (config: Config): ProfileService => {
  const { db } = config;
  const accountRepository = new AccountRepository(db);
  return new ProfileService(accountRepository);
};

const getProfile: Route<Config, {}, IAccountRecord> = {
  name: "getProfile",
  path: "/profiles/:username",
  method: "GET",
  handler: (config: Config): HandlerFn<{}, IAccountRecord>[] => {
    const service = getService(config);
    return [
      async (_, req, res) => {
        const { username } = req.params;
        const result = await service.getByUsername(username);
        res.send({
          body: result,
          statusCode: 200
        });
      }
    ];
  }
};

export const routes: Route<Config>[] = [getProfile];
