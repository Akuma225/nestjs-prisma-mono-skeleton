import { Injectable } from '@nestjs/common';
import { ViewmodelService } from '../services/viewmodel.service';

@Injectable()
export class ViewmodelServiceProvider {
  private static service: ViewmodelService;

  static setService(service: ViewmodelService) {
    ViewmodelServiceProvider.service = service;
  }

  static getService(): ViewmodelService {
    return ViewmodelServiceProvider.service;
  }
}
