import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from '../interceptors/transaction.interceptor';

export function Transaction() {
    return applyDecorators(UseInterceptors(TransactionInterceptor));
}
