import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AccessTokenData } from '../shared/entities/access-token-data.entity';

@Injectable()
export class SecurityService {
  constructor() { }

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
}
