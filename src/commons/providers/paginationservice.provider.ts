import { Injectable } from '@nestjs/common';
import { PaginationService } from '../services/pagination.service';

@Injectable()
export class PaginationServiceProvider {
  private static service: PaginationService;

  static setPaginationService(service: PaginationService) {
    PaginationServiceProvider.service = service;
  }

  static getPaginationService(): PaginationService {
    return PaginationServiceProvider.service;
  }
}
