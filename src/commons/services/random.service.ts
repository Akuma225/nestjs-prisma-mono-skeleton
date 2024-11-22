import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  constructor() { }

  /**
   * Generates an array with random elements from the given array.
   * 
   * @param array - The source array to pick elements from.
   * @param length - The desired length of the random array.
   * @returns A new array with random elements from the source array.
   */
  randomArray(array: any[], length: number): any[] {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
      randomArray.push(array[Math.floor(Math.random() * array.length)]);
    }
    return randomArray;
  }

  /**
   * Generates a random boolean value.
   * 
   * @returns A random boolean value (true or false).
   */
  randomBoolean(): boolean {
    return Math.random() >= 0.5;
  }

  /**
   * Generates a random integer between the specified min and max values (inclusive).
   * 
   * @param min - The minimum value of the random integer.
   * @param max - The maximum value of the random integer.
   * @returns A random integer between min and max (inclusive).
   */
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generates a random OTP (One-Time Password) of the specified length.
   * 
   * @param length - The length of the OTP.
   * @returns A string representing the random OTP.
   */
  randomOtp(length: number): string {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return otp;
  }

  /**
   * Generates a random token of the specified length.
   * 
   * @param length - The length of the token.
   * @returns A string representing the random token.
   */
  randomToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
}
