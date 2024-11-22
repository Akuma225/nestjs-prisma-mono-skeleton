import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
    private client;

    constructor(
        private readonly configService: ConfigService
    ) {
        const redisHost = this.configService.get<string>('REDIS_HOST') || 'localhost';
        const redisPort = this.configService.get<number>('REDIS_PORT') || 6379;

        // Check and log the values
        console.log(`REDIS_HOST: ${redisHost}, REDIS_PORT: ${redisPort}`);

        // Ensure values are strings
        const redisUrl = `redis://${redisHost}:${redisPort}`;

        console.log(`Connecting to Redis at ${redisUrl}`);

        this.client = createClient({
            url: redisUrl,
            password: this.configService.get<string>('REDIS_PASSWORD'),
        });
        
        this.client.connect().catch(error => {
            console.error('Error connecting to Redis:', error);
        });
    }

    async get(key: string): Promise<string> {
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl: number) {
        await this.client.set(key, value, {
            EX: ttl,
        });
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async delByPattern(pattern: string): Promise<void> {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
            await this.client.del(keys);
        }
    }
}
