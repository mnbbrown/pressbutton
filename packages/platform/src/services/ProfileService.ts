import {
  IAccountRepository,
  IAccountRecord,
  TAccountRepository
} from "../repositories/AccountRepository";
import { HttpError } from "../utils/http";
import { inject, injectable, LazyServiceIdentifer } from "inversify";

console.log(TAccountRepository);

export const TProfileService = "TProfileService";

export interface IProfileService {
  getByUsername(username: string): Promise<IAccountRecord>;
}

@injectable()
export class ProfileService implements IProfileService {
  @inject(new LazyServiceIdentifer(() => TAccountRepository)) private repository: IAccountRepository;
  public async getByUsername(username: string): Promise<IAccountRecord> {
    const profile = await this.repository.getByUsername(username);
    if (!profile) {
      throw new HttpError(404, "Profile not found");
    }
    return profile;
  }
}
