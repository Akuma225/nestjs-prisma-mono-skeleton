import { Injectable } from '@nestjs/common';
import { PaginationService } from '../services/pagination.service';

@Injectable()
export class PaginationServiceProvider {
  private static service: PaginationService;

  static setService(service: PaginationService) {
    PaginationServiceProvider.service = service;
  }

  static getService(): PaginationService {
    return PaginationServiceProvider.service;
  }
}
