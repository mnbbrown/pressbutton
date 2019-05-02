import { AccountRepository } from "../repositories/AccountRepository";
import { Route } from "../adapters";
import { Config } from "../config";
import { error } from "../middleware/errors";

export const getStatus: Route<Config, {}, { count: number }> = {
  name: "getStatus",
  path: "/status",
  method: "GET",
  isPublic: true,
  handler: (config: Config) => {
    const repository = new AccountRepository(config.db);
    return [
      error,
      async (_, res) => {
        const count = await repository.count();
        res.send({
          body: { count }
        });
      }
    ];
  }
};
