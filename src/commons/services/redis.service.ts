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

    /**
     * Retrieves the value associated with the given key from Redis.
     * @param key - The key to retrieve the value for.
     * @returns A Promise that resolves to the value associated with the key.
     */
    async get(key: string): Promise<string> {
        return this.client.get(key);
    }

    /**
     * Sets the value associated with the given key in Redis.
     * @param key - The key to set the value for.
     * @param value - The value to set.
     * @param ttl - The time-to-live (in seconds) for the key-value pair.
     */
    async set(key: string, value: string, ttl: number) {
        await this.client.set(key, value, {
            EX: ttl,
        });
    }
}
