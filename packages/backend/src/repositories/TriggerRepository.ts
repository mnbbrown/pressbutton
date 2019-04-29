import { db } from "../db";
import { DestinationConfigs } from "../destinations";

interface ITrigger {
  id: string;
  token: string;
  accountId: string;
  next: string;
  config: DestinationConfigs;
}

export interface ITriggerRepository {
  getByToken(token: string): Promise<ITrigger | undefined>;
}

export class TriggerRepository implements ITriggerRepository {
  public async getByToken(token: string): Promise<ITrigger | undefined> {
    const result = await db
      .select("id", "token", "accountId", "config", "next")
      .from("triggers")
      .where({ token })
      .limit(1)
      .first();
    return result;
  }
}
