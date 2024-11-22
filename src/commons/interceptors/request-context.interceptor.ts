import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from '../services/request-context.service';

/**
    * Intercepts incoming requests and sets the request context using the RequestContextService.
    * @param context - The execution context of the request.
    * @param next - The next handler in the chain.
    * @returns An observable representing the result of the next handler.
    */
@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
    constructor(private requestContextService: RequestContextService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        this.requestContextService.setContext(request);
        return next.handle();
    }
}