import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  constructor() {}

  randomArray(array, length) {
    const randomArray = [];
    for (let i = 0; i < length; i++) {
      randomArray.push(array[Math.floor(Math.random() * array.length)]);
    }
    return randomArray;
  }

  randomBoolean() {
    return Math.random() >= 0.5;
  }

  randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomToken(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
  }
}
