import { Injectable } from '@nestjs/common';
import { RedisService } from '../services/redis.service';

@Injectable()
export class RedisServiceProvider {
  private static service: RedisService;

  static setService(service: RedisService) {
    RedisServiceProvider.service = service;
  }

  static getService(): RedisService {
    return RedisServiceProvider.service;
  }
}
