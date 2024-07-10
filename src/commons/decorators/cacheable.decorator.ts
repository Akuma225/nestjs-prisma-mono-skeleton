import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '../interceptors/cache.interceptor';

export function Cacheable() {
    return applyDecorators(UseInterceptors(CacheInterceptor));
}
