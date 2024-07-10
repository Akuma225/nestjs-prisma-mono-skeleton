import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    private client;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = createClient({
            url: `redis://${this.configService.get<string>('REDIS_HOST')}:${this.configService.get<number>('REDIS_PORT')}`,
        });
        this.client.connect();
    }

    async get(key: string): Promise<string> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl: number) {
        await this.client.set(key, value, {
            EX: ttl,
        });
    }
}
