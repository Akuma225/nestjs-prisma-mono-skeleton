import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

@Injectable()
export class SecurityService {
  constructor() {}

  signJwt(data: any, secret: string, expiresIn: string = '1d') {
    return jwt.sign(data, secret, { expiresIn });
  }

  verifyJwt(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  async generateAccessToken(data) {
    return this.signJwt(
      data,
      process.env.JWT_SECRET,
      process.env.ACCESS_TOKEN_EXPIRE,
    );
  }

  async generateRefreshToken(data) {
    return this.signJwt(
      data,
      process.env.REFRESH_TOKEN_SECRET,
      process.env.REFRESH_TOKEN_EXPIRE,
    );
  }

  async verifyAccessToken(token: string) {
    return this.verifyJwt(token, process.env.JWT_SECRET);
  }

  async verifyRefreshToken(token: string) {
    return this.verifyJwt(token, process.env.REFRESH_TOKEN_SECRET);
  }
}
