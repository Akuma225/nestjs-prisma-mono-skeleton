import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInvalidationInterceptor } from '../interceptors/cache-invalidation.interceptor';

export function InvalidateCache(patterns: string[]) {
    return applyDecorators(UseInterceptors(new CacheInvalidationInterceptor(patterns)));
}
