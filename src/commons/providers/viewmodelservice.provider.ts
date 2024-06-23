import { Injectable } from '@nestjs/common';
import { ViewmodelService } from '../services/viewmodel.service';

@Injectable()
export class ViewmodelServiceProvider {
  private static service: ViewmodelService;

  static setViewmodelService(service: ViewmodelService) {
    ViewmodelServiceProvider.service = service;
  }

  static getViewmodelService(): ViewmodelService {
    return ViewmodelServiceProvider.service;
  }
}
