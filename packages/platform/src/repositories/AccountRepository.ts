import Knex from "knex";
import { TDB } from '../db'
import { injectable, inject } from "inversify";

export interface IAccountRecord {
  username: string;
  id: number;
}

export const TAccountRepository = "TAccountRepository";

export interface IAccountRepository {
  getByUsername(username: string): Promise<IAccountRecord | undefined>;
  count(): Promise<number>;
}

@injectable()
export class AccountRepository implements IAccountRepository {
  @inject(TDB) private db: Knex;

  public async getByUsername(
    username: string
  ): Promise<IAccountRecord | undefined> {
    return this.db("accounts")
      .select("id", "username")
      .where({
        username
      })
      .limit(1)
      .first();
  }

  public async count(): Promise<number> {
    const result = await this.db("accounts")
      .count("*")
      .first();
    return result.count;
  }
}
