import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
  } from '@nestjs/common';
  import { from, lastValueFrom, Observable, throwError } from 'rxjs';
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
    constructor(private readonly prisma: PrismaService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request: CustomRequest = context.switchToHttp().getRequest();
      request.transaction = true;
  
      return from(this.prisma.$transaction(tx => {
        context.switchToHttp().getRequest().prismaTransaction = tx;
        return next.handle().toPromise();
      }, {
        maxWait: 15000,
        timeout: 30000,
      })).pipe(
        catchError((error) => {
          // La transaction est automatiquement annulée si une erreur est levée
          Logger.log("Error in transaction. Rolling back...");
          return throwError(() => error);
        })
      );
    }
  }