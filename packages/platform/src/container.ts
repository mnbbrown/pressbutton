import { Container } from "inversify";
import * as reflect from "reflect-metadata";
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
import { factory } from "./db";
import Knex from "knex";
export const DB = "DB";


export const createContainer = (): Container => {
  console.log(reflect);
  const container = new Container();
  const logger = makeLoggerMiddleware();
  container.applyMiddleware(logger);
  container.bind<Knex>(DB).toFactory(() => factory());
  container.bind<IAccountRepository>(TAccountRepository).to(AccountRepository);
  container.bind<IProfileService>(TProfileService).to(ProfileService);
  return container;
};
