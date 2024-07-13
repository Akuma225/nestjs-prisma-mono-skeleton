import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { unlink } from 'fs';

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            catchError((err) => {
                if (request.filesToDelete) {
                    request.filesToDelete.forEach((filePath: string) => {
                        unlink(filePath, (error) => {
                            if (error) {
                                Logger.error(`Failed to delete file ${filePath}:`, error);
                            } else {
                                Logger.log(`File ${filePath} deleted successfully.`);
                            }
                        });
                    });
                }
                throw err;
            })
        );
    }
}
