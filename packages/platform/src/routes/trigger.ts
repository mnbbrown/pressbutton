import { TriggerService } from "../services/TriggerService";
import { Route, HandlerFn } from "../adapters";
import { TriggerRepository } from "../repositories/TriggerRepository";
import { Config } from "../config";

const getService = (config: Config): TriggerService => {
  const { db } = config;
  const repository = new TriggerRepository(db);
  return new TriggerService(repository);
};

const handler = (config: Config): HandlerFn[] => {
  const service = getService(config);
  return [
    async (_, req, res) => {
      const { token } = req.query;
      await service.invoke(token);
      res.send({
        body: undefined,
        statusCode: 204
      });
    }
  ];
};

const getTrigger: Route<Config, {}, {}> = {
  name: "getTrigger",
  path: "trigger",
  method: "GET",
  handler
};

const postTrigger: Route<Config, {}, {}> = {
  name: "postTrigger",
  path: "trigger",
  method: "POST",
  handler
};

export const routes: Route<Config>[] = [getTrigger, postTrigger];
