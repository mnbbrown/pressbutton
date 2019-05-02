import {
  IAccountRepository,
  IAccountRecord
} from "../repositories/AccountRepository";
import { HttpError } from "../utils/http";

export class ProfileService {
  public constructor(private repository: IAccountRepository) {}
  public async getByUsername(username: string): Promise<IAccountRecord> {
    const profile = await this.repository.getByUsername(username);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }
}
