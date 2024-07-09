import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaginationParams } from '../interfaces/pagination-params';
import { PaginationService } from './pagination.service';
import { PaginationVm } from '../shared/viewmodels/pagination.vm';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { PrismaServiceProvider } from '../providers/prismaservice.provider';
import { PaginationServiceProvider } from '../providers/paginationservice.provider';

@Injectable()
/**
 * Base CRUD Service for performing common CRUD operations.
 *
 * @template T - The type of the data being manipulated.
 */
export class BaseCRUDService<T> {
  protected readonly modelName: string

  // The model to be used for CRUD operations.
  protected model: any;
  protected pagination: PaginationService;

  // Static properties to hold the Prisma and Pagination services.
  protected static prisma: PrismaService;
  protected static paginationService: PaginationService;

  constructor(
    protected readonly modelNameParam: string
  ) {
    this.modelName = modelNameParam
  }

  initModel() {
    const prisma = BaseCRUDService.getPrismaService();
    return prisma[this.modelName]
  }

  private static getPrismaService(): PrismaService {
    if (!BaseCRUDService.prisma) {
      BaseCRUDService.prisma = PrismaServiceProvider.getPrismaService();
    }
    return BaseCRUDService.prisma;
  }

  private static getPaginationService(): PaginationService {
    if (!BaseCRUDService.paginationService) {
      BaseCRUDService.paginationService = PaginationServiceProvider.getPaginationService();
    }
    return BaseCRUDService.paginationService;
  }

  /**
   * Creates a new record in the database.
   * 
   * @param data - The data for the new record.
   * @returns A Promise that resolves to the created record.
   * @throws HttpException if there is an error creating the record.
   */
  async genericCreate(data: any): Promise<T> {
    try {
      this.model = this.initModel()
      return await this.model.create({ data });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error creating record', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retrieves paginated records from the database based on the provided parameters.
   *
   * @param params - The pagination parameters.
   * @param whereClause - The where clause to filter the records.
   * @param include - The associations to include in the query.
   * @param orderBy - The order by criteria for sorting the records.
   * @returns A Promise that resolves to a PaginationVm object containing the paginated records.
   * @throws HttpException if there is an error fetching the records.
   */
  async genericFindAll(
    params?: IPaginationParams | undefined,
    whereClause: any = {},
    include: any = {},
    orderBy: any[] = []
  ): Promise<PaginationVm> {
    try {
      this.model = this.initModel()
      this.pagination = BaseCRUDService.getPaginationService();

      whereClause.deleted_at = null;
      return this.pagination.paginate(
        this.modelName,
        whereClause,
        include,
        orderBy,
        params,
        ['name', 'description']
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error fetching records', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Retrieves a single record by its ID.
   *
   * @param id - The ID of the record to retrieve.
   * @returns A promise that resolves to the retrieved record.
   * @throws {HttpException} If an error occurs while fetching the record.
   */
  async genericFindOne(id: string): Promise<T> {
    try {
      this.model = this.initModel()

      return await this.model.findUnique({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error fetching record', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Updates a record in the database.
   *
   * @param id - The ID of the record to update.
   * @param data - The partial data to update the record with.
   * @returns A promise that resolves to the updated record.
   * @throws {HttpException} If there is an error updating the record.
   */
  async genericUpdate(id: string, data: Partial<any>): Promise<T> {
    try {
      this.model = this.initModel()

      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error updating record', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Deletes a record from the database based on the provided ID.
   * 
   * @param id - The ID of the record to delete.
   * @returns A promise that resolves to the deleted record.
   * @throws {HttpException} If an error occurs while deleting the record.
   */
  async genericDelete(id: string): Promise<T> {
    try {
      this.model = this.initModel()

      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error deleting record', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Soft deletes a record of type T based on the provided id.
   * @param id - The id of the record to be soft deleted.
   * @returns A promise that resolves to the updated record after soft deletion.
   * @throws HttpException if an error occurs during soft deletion.
   */
  async genericSoftDelete(id: string): Promise<T> {
    try {
      this.model = this.initModel()

      return await this.model.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error soft deleting record', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Restores a record by setting the `deletedAt` property to null.
   * @param id - The ID of the record to restore.
   * @returns A promise that resolves to the restored record.
   * @throws {HttpException} If there is an error restoring the record.
   */
  async genericRestore(id: string): Promise<T> {
    try {
      this.model = this.initModel()

      return await this.model.update({
        where: { id },
        data: { deleted_at: null },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error restoring record', HttpStatus.BAD_REQUEST);
    }
  }
}
