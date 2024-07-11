import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class RequestContextService {
    private context: any;

    setContext(context: any) {
        this.context = context;
    }

    getContext() {
        return this.context;
    }
}