import { Injectable } from '@nestjs/common';
import { RedisService } from '../services/redis.service';

@Injectable()
export class RedisServiceProvider {
  private static service: RedisService;

  static setRedisService(service: RedisService) {
    RedisServiceProvider.service = service;
  }

  static getRedisService(): RedisService {
    return RedisServiceProvider.service;
  }
}
