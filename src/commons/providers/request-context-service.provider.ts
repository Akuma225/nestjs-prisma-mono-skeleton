import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class RequestContextServiceProvider {
  private static service: RequestContextService;

  static setRequestContextService(service: RequestContextService) {
    RequestContextServiceProvider.service = service;
  }

  static getRequestContextService(): RequestContextService {
    return RequestContextServiceProvider.service;
  }
}
