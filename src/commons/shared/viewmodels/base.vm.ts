import { ViewmodelService } from 'src/commons/services/viewmodel.service';
import { AuditVm } from './audit.vm';
import { ViewmodelServiceProvider } from 'src/commons/providers/viewmodelservice.provider';
import { AuditProperties } from 'src/commons/enums/audit_properties.enum';
import { HttpException } from '@nestjs/common';
import { PaginationVm } from './pagination.vm';

export class BaseVm extends AuditVm {
  private static viewmodelService: ViewmodelService;
  private static defaultAuditProperties: AuditProperties[] = [
    AuditProperties.CREATED_BY,
    AuditProperties.UPDATED_BY,
    AuditProperties.DELETED_BY,
  ];

  constructor(data: any) {
    super(data);
  }

  private static getService(): ViewmodelService {
    if (!BaseVm.viewmodelService) {
      BaseVm.viewmodelService = ViewmodelServiceProvider.getViewmodelService();
    }
    return BaseVm.viewmodelService;
  }

  static async create<T extends BaseVm>(
    this: new (data: any) => T,
    data: any,
    extendedAudit = false,
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<T> {
    if (!data) {
      throw new HttpException('Donnée introuvable', 404);
    }

    const viewmodelService = BaseVm.getService();
    const additionalProperties = await viewmodelService.processAuditFields(
      data,
      extendedAudit,
      properties
    );
    return new this({ ...data, ...additionalProperties });
  }

  static async createArray<T extends BaseVm>(
    this: new (data: any) => T,
    dataArray: any[],
    extendedAudit = false,
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<T[]> {
    if (!dataArray || !Array.isArray(dataArray)) {
      throw new HttpException('Données introuvables ou incorrectes', 404);
    }

    const viewmodelService = BaseVm.getService();
    const promises = dataArray.map(async data => {
      const additionalProperties = await viewmodelService.processAuditFields(
        data,
        extendedAudit,
        properties
      );
      return new this({ ...data, ...additionalProperties });
    });

    return Promise.all(promises);
  }

  static async createPaginated<T extends BaseVm>(
    this: new (data: any) => T,
    data: PaginationVm,
    extendedAudit = false,
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<{ items: T[], totalCount: number }> {
    const { result, totalCount } = data;

    if (!result || !Array.isArray(result)) {
      throw new HttpException('Données introuvables ou incorrectes', 404);
    }

    const viewmodelService = BaseVm.getService();
    const promises = result.map(async item => {
      const additionalProperties = await viewmodelService.processAuditFields(
        item,
        extendedAudit,
        properties
      );
      return new this({ ...item, ...additionalProperties });
    });

    const processedItems = await Promise.all(promises);
    return { items: processedItems, totalCount };
  }
}
