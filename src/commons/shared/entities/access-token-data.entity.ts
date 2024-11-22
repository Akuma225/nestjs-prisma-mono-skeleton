import { UserData } from "./user-data.entity";

export class AccessTokenData {
  sub: UserData;

  constructor(data) {
    this.sub = new UserData(data);
  }
}
