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
import { RedisServiceProvider } from '../providers/redis-service.provider';
import * as crypto from 'crypto';

/**
 * Interceptor that provides caching functionality for requests.
 */
@Injectable()
export class CacheInterceptor implements NestInterceptor {

    protected static redisService: RedisService;

    constructor(
        private readonly configService: ConfigService
    ) { }

    /**
     * Intercepts the incoming request and checks if the response is already cached.
     * If the response is cached, it returns the cached data.
     * If the response is not cached, it forwards the request to the next handler and caches the response.
     * @param context - The execution context.
     * @param next - The next call handler.
     * @returns An observable that emits the response data.
     */
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
                redis.set(key, JSON.stringify(response), ttl);
            }),
        );
    }

    /**
     * Retrieves the Redis service instance.
     * If the instance does not exist, it creates a new instance and returns it.
     * @returns The Redis service instance.
     */
    private static getRedisService(): RedisService {
        if (!CacheInterceptor.redisService) {
            CacheInterceptor.redisService = RedisServiceProvider.getService();
        }
        return CacheInterceptor.redisService;
    }

    /**
     * Generates a unique cache key based on the request details.
     * @param request - The incoming request.
     * @returns The cache key.
     */
    // private generateKey(request: Request): string {
    //     const { method, originalUrl, body, params, query } = request;
    //     const key = `${method}-${originalUrl}-${JSON.stringify(body)}-${JSON.stringify(params)}-${JSON.stringify(query)}`;
    //     return key;
    // }
    private generateKey(request: Request): string {
        const { method, originalUrl, query, params, body } = request;
    
        // Structure hiérarchique : "namespace" - "resource" - hash du body - hash des params - hash des query params
        const resource = originalUrl || 'root';
    
        const namespace = `${method.toUpperCase()}-${resource}`;
    
        const queryHash = crypto
            .createHash('md5')
            .update(JSON.stringify(query))
            .digest('hex');
        const paramsHash = crypto
            .createHash('md5')
            .update(JSON.stringify(params))
            .digest('hex');
        const bodyHash = crypto
            .createHash('md5')
            .update(JSON.stringify(body))
            .digest('hex');
    
        return `${namespace}-${bodyHash}-${paramsHash}-${queryHash}`;
    }
}
