import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly prisma: PrismaService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        this.prisma.startTransaction();

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
