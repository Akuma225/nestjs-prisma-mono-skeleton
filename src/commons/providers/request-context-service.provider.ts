import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
export class RequestContextServiceProvider {
  private static service: RequestContextService;

  static setService(service: RequestContextService) {
    RequestContextServiceProvider.service = service;
  }

  static getService(): RequestContextService {
    return RequestContextServiceProvider.service;
  }
}
