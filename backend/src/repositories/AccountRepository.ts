import { db } from "../db";

export interface IAccountRecord {
  username: string;
  id: number;
}

export interface IAccountRepository {
  getByUsername(username: string): Promise<IAccountRecord | undefined>;
}

export class AccountRepository implements IAccountRepository {
  public async getByUsername(
    username: string
  ): Promise<IAccountRecord | undefined> {
    return db("accounts")
      .select("id", "username")
      .where({
        username
      })
      .limit(1)
      .first();
  }
}
