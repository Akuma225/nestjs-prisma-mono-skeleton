import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaginationParams } from '../interfaces/pagination-params';
import { PaginationService } from './pagination.service';
import { PaginationVm } from '../shared/viewmodels/pagination.vm';
import { PrismaServiceProvider } from '../providers/prisma-service.provider';
import { PaginationServiceProvider } from '../providers/pagination-service.provider';
import { RequestContextService } from './request-context.service';
import { RequestContextServiceProvider } from '../providers/request-context-service.provider';
import { CustomRequest } from '../interfaces/custom_request';
import { GenericCreateOptions } from '../interfaces/services/base-crud/generic-create-options';
import { GenericFindAllOptions } from '../interfaces/services/base-crud/generic-find-all-options';
import { GenericFindOneOptions } from '../interfaces/services/base-crud/generic-find-one-options';
import { GenericFindOneByOptions } from '../interfaces/services/base-crud/generic-find-one-by-options';
import { GenericUpdateOptions } from '../interfaces/services/base-crud/generic-update-options';
import { GenericDefaultOptions } from '../interfaces/services/base-crud/generic-default-options';
import { GenericGroupByOptions } from '../interfaces/services/base-crud/generic-group-by-options';

/**
 * Base CRUD Service class for performing CRUD operations on a model.
 * @template T - The type of the model.
 */
@Injectable()
export abstract class BaseCRUDService<T> {
  protected readonly modelName: string;
  protected model: any;
  protected pagination: PaginationService;

  protected static prisma: PrismaService;
  protected static paginationService: PaginationService;
  protected static requestContextService: RequestContextService;

  constructor(protected readonly modelNameParam: string) {
    this.modelName = modelNameParam;
  }

  private initModel() {
    return BaseCRUDService.getPrismaService()[this.modelName];
  }

  private initServices() {
    this.pagination = BaseCRUDService.getPaginationService();
    this.model = this.initModel();
  }

  private static getPrismaService(): PrismaService {
    if (!BaseCRUDService.prisma) {
      BaseCRUDService.prisma = PrismaServiceProvider.getService();
    }
    return BaseCRUDService.prisma;
  }

  private static getRequestContextService(): RequestContextService {
    if (!BaseCRUDService.requestContextService) {
      BaseCRUDService.requestContextService = RequestContextServiceProvider.getService();
    }
    return BaseCRUDService.requestContextService;
  }

  private static getPaginationService(): PaginationService {
    if (!BaseCRUDService.paginationService) {
      BaseCRUDService.paginationService = PaginationServiceProvider.getService();
    }
    return BaseCRUDService.paginationService;
  }

  private handleError(error: any, message: string) {
    Logger.error(error);
    throw new HttpException(message, HttpStatus.BAD_REQUEST);
  }

  async genericCreate(options: GenericCreateOptions): Promise<T> {
    const { data, include, select, connectedUserId } = options
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.create({
          data: {
            ...data,
            created_by: connectedUserId,
          },
          include,
          select: !include ? select : undefined,
        });
      } catch (error) {
        this.handleError(error, 'Error creating record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const createdData = await prisma.create({
        model: this.modelName,
        data: {
          ...data,
          created_by: connectedUserId,
        },
        include,
        select
      });

      return createdData;
    } catch (error) {
      this.handleError(error, 'Error creating record');
    }
  }

  /*async genericCreateMany(
    data: any[],
    connectedUserId?: string,
    include: any = {},
    select: any = {}
  ): Promise<T[]> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.createMany({
          data: data.map(d => ({
            ...d,
            created_by: connectedUserId,
          })),
          include,
          select: !include ? select : undefined,
        });
      } catch (error) {
        this.handleError(error, 'Error creating records');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const createdData = await prisma.createMany(this.modelName, data.map(d => ({
        ...d,
        created_by: connectedUserId,
      })), include, select);

      return createdData;
    } catch (error) {
      this.handleError(error, 'Error creating records');
    }
  }*/

  async genericFindAll(options: GenericFindAllOptions): Promise<PaginationVm> {
    let { whereClause, include, select, searchables, orderBy, params } = options
    whereClause = whereClause || {}
    this.initServices();

    try {
      whereClause.deleted_at = null;
      return this.pagination.paginate({
        model: this.modelName,
        where: whereClause,
        include,
        orderBy,
        select,
        params,
        searchables
      });
    } catch (error) {
      this.handleError(error, 'Error fetching records');
    }
  }

  async genericFindOne(options: GenericFindOneOptions): Promise<T> {
    let { id, include, select } = options
    this.initServices();

    try {
      return await this.model.findUnique({
        where: { id },
        include,
        select: !include ? select : undefined,
      });
    } catch (error) {
      this.handleError(error, 'Error fetching record');
    }
  }

  async genericFindOneBy(options: GenericFindOneByOptions): Promise<T> {
    let { whereClause, include, select } = options

    this.initServices();

    try {
      return await this.model.findFirst({
        where: whereClause,
        include,
        select: !include ? select : undefined,
      });
    } catch (error) {
      this.handleError(error, 'Error fetching record');
    }
  }

  async genericUpdate(options: GenericUpdateOptions): Promise<T> {
    let { id, data, include, select, connectedUserId } = options

    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: {
            ...data,
            updated_by: connectedUserId,
          },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error updating record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update({ model: this.modelName, where: { id }, data: { ...data, updated_by: connectedUserId }, include, select });

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error updating record');
    }
  }

  async genericDelete(
    id: string
  ): Promise<T> {
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.delete({ where: { id } });
      } catch (error) {
        this.handleError(error, 'Error deleting record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const deletedData = await prisma.delete({ model: this.modelName, where: { id } });

      return deletedData;
    } catch (error) {
      this.handleError(error, 'Error deleting record');
    }
  }

  async genericSoftDelete(options: GenericDefaultOptions): Promise<T> {
    let { id, connectedUserId, include, select } = options
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: { deleted_at: new Date(), deleted_by: connectedUserId },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error soft deleting record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update({
        model: this.modelName,
        where: { id },
        data: { deleted_at: new Date(), deleted_by: connectedUserId },
        include,
        select
      });

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error soft deleting record');
    }
  }

  async genericRestore(options: GenericDefaultOptions): Promise<T> {
    let { id, connectedUserId, include, select } = options
    this.initServices();

    const requestContext = BaseCRUDService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (!request.transaction) {
      try {
        return await this.model.update({
          where: { id },
          data: { deleted_at: null, deleted_by: null, updated_by: connectedUserId },
          include,
          select: !include ? select : undefined
        });
      } catch (error) {
        this.handleError(error, 'Error restoring record');
      }
    }

    try {
      const prisma = BaseCRUDService.getPrismaService();
      const updatedData = await prisma.update({ model: this.modelName, where: { id }, data: { deleted_at: null, deleted_by: null, updated_by: connectedUserId }, include, select });

      return updatedData;
    } catch (error) {
      this.handleError(error, 'Error restoring record');
    }
  }

  async genericCount(whereClause: any = {}): Promise<number> {
    this.initServices();

    try {
      return await this.model.count({ where: whereClause });
    } catch (error) {
      this.handleError(error, 'Error counting records');
    }
  }

  async genericGroupBy(options: GenericGroupByOptions): Promise<any> {
    let { by, whereClause, orderBy, skip, take } = options

    skip = skip || 0
    take = take || 10

    this.initServices();

    try {
      return await this.model.groupBy({
        by,
        where: whereClause,
        orderBy,
        skip,
        take,
      });
    } catch (error) {
      this.handleError(error, 'Error grouping records');
    }
  }

  // Méthodes abstraites à implémenter par les classes dérivées
  abstract create(data: any, connectedUserId?: string): Promise<T>;
  abstract findAll(params?: IPaginationParams, whereClause?: any): Promise<PaginationVm>;
  abstract findOne(id: string): Promise<T>;
  abstract update(id: string, data: Partial<any>, connectedUserId?: string): Promise<T>;
  abstract delete(id: string): Promise<T>;
  abstract softDelete(id: string, connectedUserId?: string): Promise<T>;
  abstract restore(id: string, connectedUserId?: string): Promise<T>;
}
