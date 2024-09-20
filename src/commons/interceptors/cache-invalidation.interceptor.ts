import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../services/redis.service';
import { RedisServiceProvider } from '../providers/redis-service.provider';

/**
 * Interceptor that invalidates the cache for specific patterns after a request.
 */
@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
    protected static redisService: RedisService;

    constructor(private readonly patterns: string[]) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            tap(async () => {
                const redis = CacheInvalidationInterceptor.getRedisService();
                // Invalidate cache by pattern after the request is handled
                for (const pattern of this.patterns) {
                    Logger.log(`CacheInvalidationInterceptor: Invalidating cache for pattern ${pattern}`);
                    await redis.delByPattern(pattern);   
                }
            }),
        );
    }

    /**
     * Retrieves the Redis service instance.
     * If the instance does not exist, it creates a new instance and returns it.
     * @returns The Redis service instance.
     */
    private static getRedisService(): RedisService {
        if (!CacheInvalidationInterceptor.redisService) {
            CacheInvalidationInterceptor.redisService = RedisServiceProvider.getService();
        }
        return CacheInvalidationInterceptor.redisService;
    }
}
