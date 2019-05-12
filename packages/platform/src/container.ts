import { Container } from "inversify";
import { makeLoggerMiddleware } from "inversify-logger-middleware";
import {
  AccountRepository,
  TAccountRepository,
  IAccountRepository
} from "./repositories/AccountRepository";
import {
  ProfileService,
  IProfileService,
  TProfileService
} from "./services/ProfileService";
import { TDB, factory } from "./db";
import Knex from "knex";


export const createContainer = (): Container => {
  const container = new Container();
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
  container.bind<Knex>(TDB).toFactory(() => factory());
  container.bind<IAccountRepository>(TAccountRepository).to(AccountRepository);
  container.bind<IProfileService>(TProfileService).to(ProfileService);
  return container;
};
