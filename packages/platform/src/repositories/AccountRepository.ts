import * as Knex from "knex";
export interface IAccountRecord {
  username: string;
  id: number;
}

export interface IAccountRepository {
  getByUsername(username: string): Promise<IAccountRecord | undefined>;
  count(): Promise<number>;
}

export class AccountRepository implements IAccountRepository {
  public constructor(private db: Knex) {}

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
