import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { from, Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';
import { CustomRequest } from '../interfaces/custom_request';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      Logger.log("Starting transaction...");
      const request: CustomRequest = context.switchToHttp().getRequest();
      request.transaction = true;

      return from(this.prismaService.$transaction(tx => {
          request.prismaTransaction = tx;
          return next.handle().toPromise();
      }, {
          maxWait: 15000,
          timeout: 30000,
      })).pipe(
          catchError((error) => {
              Logger.log("Error in transaction. Rolling back...");
              return throwError(() => error);
          }),
          finalize(() => {
              Logger.log("Ending transaction. Cleaning up...");
              // Nettoyer la transaction après chaque requête
              request.prismaTransaction = null;
              request.transaction = false;
          })
      );
  }
}