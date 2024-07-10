import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { RedisService } from '../services/redis.service';
import { ConfigService } from '@nestjs/config';
import { RedisServiceProvider } from '../providers/redisservice.provider';

@Injectable()
export class CacheInterceptor implements NestInterceptor {

    protected static redisService: RedisService;

    constructor(
        private readonly configService: ConfigService
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<Request>();
        const key = this.generateKey(request);

        const redis = CacheInterceptor.getRedisService();

        Logger.log(`CacheInterceptor: ${key}`)

        const cachedResponse = await redis.get(key);
        if (cachedResponse) {
            Logger.log(`CacheInterceptor: ${key} - Cache hit`)
            const cachedData = of(JSON.parse(cachedResponse))
            return cachedData;
        }

        const ttl = this.configService.get<number>('REDIS_CACHE_TTL');

        return next.handle().pipe(
            tap(async (response) => {
                await redis.set(key, JSON.stringify(response), ttl);
            }),
        );
    }

    private static getRedisService(): RedisService {
        if (!CacheInterceptor.redisService) {
            CacheInterceptor.redisService = RedisServiceProvider.getRedisService();
        }
        return CacheInterceptor.redisService;
    }

    private generateKey(request: Request): string {
        const { method, originalUrl, body, params, query } = request;
        const key = `${method}-${originalUrl}-${JSON.stringify(body)}-${JSON.stringify(params)}-${JSON.stringify(query)}`;
        return key;
    }
}
