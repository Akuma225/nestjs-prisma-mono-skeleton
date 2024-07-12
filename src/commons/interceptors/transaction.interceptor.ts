import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';
import { CustomRequest } from '../interfaces/custom_request';

/**
    * Intercepts the incoming request and starts a transaction using the Prisma service.
    * Commits the transaction if the request is successful, otherwise rolls back the transaction.
    * @param context - The execution context of the request.
    * @param next - The next call handler in the chain.
    * @returns An observable representing the result of the intercepted request.
    */
@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        this.prisma.startTransaction();

        // Get the request object
        const request: CustomRequest = context.switchToHttp().getRequest();
        request.transaction = true

        return next.handle().pipe(
            tap(() => {
                this.prisma.commitTransaction();
            }),
            catchError((err) => {
                this.prisma.rollbackTransaction();
                return throwError(err);
            }),
        );
    }
}
