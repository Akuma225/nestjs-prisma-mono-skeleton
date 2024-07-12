import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SecurityService {
  constructor() { }

  /**
   * Signs a JSON Web Token (JWT) with the given data and secret.
   *
   * @param data - The payload to sign.
   * @param secret - The secret key to sign the token with.
   * @param expiresIn - The expiration time of the token (default is '1d').
   * @returns The signed JWT.
   */
  signJwt(data: any, secret: string, expiresIn: string = '1d'): string {
    return jwt.sign(data, secret, { expiresIn });
  }

  /**
   * Verifies a JSON Web Token (JWT) with the given secret.
   *
   * @param token - The JWT to verify.
   * @param secret - The secret key to verify the token with.
   * @returns The decoded payload if the token is valid, or null if invalid.
   */
  verifyJwt(token: string, secret: string): any {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}
