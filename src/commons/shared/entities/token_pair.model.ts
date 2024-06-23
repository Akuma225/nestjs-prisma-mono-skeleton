import { ApiResponseProperty } from '@nestjs/swagger';

export class TokenPair {
  @ApiResponseProperty()
  access_token: string;

  @ApiResponseProperty()
  refresh_token: string;

  constructor({ access_token, refresh_token }) {
    this.access_token = access_token;
    this.refresh_token = refresh_token;
  }
}
