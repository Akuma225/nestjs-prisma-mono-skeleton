import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the data is a Buffer (which is used for file data), return it as is
        if (data instanceof Buffer) {
          return data;
        }

        return {
          error: false,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data && data.message ? data.message : 'Success',
          data: data ? data || null : null,
        };
      }),
      catchError((error) => {
        this.logger.error(error.message, error.stack);

        let message = error.message;

        if (error.response?.message) {
          message = Array.isArray(error.response?.message) ? error.response?.message.join(', ') : error.response?.message;
        }

        const throwerr = {
          error: true,
          statusCode: error.status || 500,
          message: message || 'Error',
          data: null,
        };

        this.logger.debug(throwerr);

        throw new HttpException(throwerr, throwerr.statusCode);
      }),
    );
  }
}
