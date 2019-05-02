import { DestinationConfigs, IDestinationsEnum } from "../destinations";
import * as Knex from "knex";

interface ITrigger {
  id: string;
  token: string;
  accountId: string;
  next: IDestinationsEnum;
  config: DestinationConfigs;
}

export interface ITriggerRepository {
  getByToken(token: string): Promise<ITrigger | undefined>;
}

export class TriggerRepository implements ITriggerRepository {
  public constructor(private db: Knex) {}
  public async getByToken(token: string): Promise<ITrigger | undefined> {
    const result = await this.db
      .select("id", "token", "accountId", "config", "next")
      .from("triggers")
      .where({ token })
      .limit(1)
      .first();
    return result;
  }
}
