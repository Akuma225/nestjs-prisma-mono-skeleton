import { ViewmodelService } from 'src/commons/services/viewmodel.service';
import { AuditVm } from './audit.vm';
import { ViewmodelServiceProvider } from 'src/commons/providers/viewmodel-service.provider';
import { AuditProperties } from 'src/commons/enums/audit_properties.enum';
import { HttpException } from '@nestjs/common';
import { PaginationVm } from './pagination.vm';
import { RequestContextService } from 'src/commons/services/request-context.service';
import { RequestContextServiceProvider } from 'src/commons/providers/request-context-service.provider';
import { CustomRequest } from 'src/commons/interfaces/custom_request';

export class BaseVm extends AuditVm {
  private static viewmodelService: ViewmodelService;
  private static requestContextService: RequestContextService;
  private static defaultAuditProperties: AuditProperties[] = [
    AuditProperties.CREATED_BY,
    AuditProperties.UPDATED_BY,
    AuditProperties.DELETED_BY,
  ];

  constructor(data: any) {
    super(data);
  }

  /**
   * Gets the shared instance of ViewmodelService.
   * If the instance does not exist, creates and returns it.
   * @returns The instance of ViewmodelService.
   */
  private static getVmService(): ViewmodelService {
    if (!BaseVm.viewmodelService) {
      BaseVm.viewmodelService = ViewmodelServiceProvider.getService();
    }
    return BaseVm.viewmodelService;
  }

  /**
   * Returns the RequestContextService instance.
   * If the instance does not exist, it will be created using the RequestContextServiceProvider.
   * @returns The RequestContextService instance.
   */
  private static getRequestCtxService(): RequestContextService {
    if (!BaseVm.requestContextService) {
      BaseVm.requestContextService = RequestContextServiceProvider.getService();
    }
    return BaseVm.requestContextService;
  }

  private static getExtendedAudit(): boolean {
    const request: CustomRequest = BaseVm.getRequestCtxService().getContext();

    return request.extended_audit;
  }

  /**
   * Creates a single instance of the view model from the provided data.
   * @template T - The type of the view model.
   * @param this - The constructor function for the view model.
   * @param data - The data to create the view model from.
   * @param extendedAudit - Optional flag to enable extended audit.
   * @param properties - Optional array of audit properties.
   * @returns A promise that resolves to the created view model instance.
   * @throws HttpException if the data is not found.
   */
  static async create<T extends BaseVm>(
    this: new (data: any) => T,
    data: any,
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<T> {
    const extendedAudit = BaseVm.getExtendedAudit();

    if (!data) {
      throw new HttpException('Donnée introuvable', 404);
    }

    const viewmodelService = BaseVm.getVmService();
    const additionalProperties = await viewmodelService.processAuditFields(
      data,
      extendedAudit,
      properties
    );
    return new this({ ...data, ...additionalProperties });
  }

  /**
   * Creates an array of view models from an array of data objects.
   * @template T - The type of the view model.
   * @param this - The constructor function for the view model.
   * @param dataArray - The array of data objects.
   * @param extendedAudit - Optional flag to enable extended audit.
   * @param properties - Optional array of audit properties.
   * @returns A promise that resolves to an array of view models.
   * @throws HttpException if the dataArray is not an array.
   */
  static async createArray<T extends BaseVm>(
    this: new (data: any) => T,
    dataArray: any[],
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<T[]> {
    const extendedAudit = BaseVm.getExtendedAudit();

    if (!dataArray || !Array.isArray(dataArray)) {
      throw new HttpException('Données introuvables ou incorrectes', 404);
    }

    const viewmodelService = BaseVm.getVmService();
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

  /**
   * Creates a paginated view model from the given pagination data.
   * @template T - The type of the view model.
   * @param this - The constructor function for the view model.
   * @param data - The pagination data to create the view model from.
   * @param extendedAudit - Optional flag to enable extended audit.
   * @param properties - Optional array of audit properties.
   * @returns A promise that resolves to a paginated view model with processed items.
   * @throws HttpException if the data is not found or incorrect.
   */
  static async createPaginated<T extends BaseVm>(
    this: new (data: any) => T,
    data: PaginationVm,
    properties: AuditProperties[] = BaseVm.defaultAuditProperties
  ): Promise<PaginationVm> {
    const extendedAudit = BaseVm.getExtendedAudit();

    const { result } = data;

    if (!result || !Array.isArray(result)) {
      throw new HttpException('Données introuvables ou incorrectes', 404);
    }

    const viewmodelService = BaseVm.getVmService();
    const promises = result.map(async item => {
      const additionalProperties = await viewmodelService.processAuditFields(
        item,
        extendedAudit,
        properties
      );
      return new this({ ...item, ...additionalProperties });
    });

    const processedItems = await Promise.all(promises);
    return {
      ...data,
      result: processedItems,
    };
  }
}
