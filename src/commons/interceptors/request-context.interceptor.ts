import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
    constructor(private requestContextService: RequestContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        this.requestContextService.setContext(request);
        return next.handle();
    }
}