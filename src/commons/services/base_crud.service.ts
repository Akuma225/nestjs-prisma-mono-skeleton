import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { IPaginationParams } from '../interfaces/pagination-params';
import { PaginationService } from './pagination.service';
import { PaginationVm } from '../shared/viewmodels/pagination.vm';
import { ModelMappingTable } from '../enums/model-mapping.enum';

@Injectable()
export class BaseCRUDService<T> {
  protected readonly model: any;

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
    protected readonly modelName: string
  ) {
    this.model = prisma[modelName];
  }

  async genericCreate(data: any): Promise<T> {
    try {
      return await this.model.create({ data });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error creating record', HttpStatus.BAD_REQUEST);
    }
  }

  async genericFindAll(
    params?: IPaginationParams | undefined,
    whereClause: any = {},
    include: any = {},
    orderBy: any[] = []
  ): Promise<PaginationVm> {
    try {
      return this.paginationService.paginate(
        this.modelName,
        whereClause,
        include,
        orderBy,
        params
      );
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error fetching records', HttpStatus.BAD_REQUEST);
    }
  }

  async genericFindOne(id: string): Promise<T> {
    try {
      return await this.model.findUnique({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error fetching record', HttpStatus.NOT_FOUND);
    }
  }

  async genericUpdate(id: string, data: Partial<any>): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error updating record', HttpStatus.BAD_REQUEST);
    }
  }

  async genericDelete(id: string): Promise<T> {
    try {
      return await this.model.delete({
        where: { id },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error deleting record', HttpStatus.BAD_REQUEST);
    }
  }

  async genericSoftDelete(id: string): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error soft deleting record', HttpStatus.BAD_REQUEST);
    }
  }

  async genericRestore(id: string): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data: { deletedAt: null },
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Error restoring record', HttpStatus.BAD_REQUEST);
    }
  }
}
