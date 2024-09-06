import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { SlugService } from 'src/commons/services/slug.service';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { PrismaService } from 'src/commons/services/prisma.service';

@Injectable()
export class CategoryService extends BaseCRUDService<CategoryEntity> {
  constructor(
    protected readonly slugService: SlugService,
    private readonly prismaService: PrismaService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  async create(createCategoryDto: CreateCategoryDto, connectedUserId?: string) {
    const slug = this.slugService.slugify(createCategoryDto.name);

    return this.genericCreate({
      data: {
        ...createCategoryDto,
        slug
      },
      connectedUserId
    });
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll({ params });
  }

  findOne(id: string) {
    return this.genericFindOne({ id });
  }

  findOneBy(whereClause: any, include?: any, select?: any): Promise<CategoryEntity> {
    return this.genericFindOneBy({ whereClause, include, select });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, connectedUserId?: string) {
    let slug = updateCategoryDto.name ? this.slugService.slugify(updateCategoryDto.name) : undefined;

    return this.genericUpdate({
      id,
      data: {
        ...updateCategoryDto,
        slug
      },
      connectedUserId
    });
  }

  delete(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete({id, connectedUserId});
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore({id, connectedUserId});
  }

  async count(whereClause?: any): Promise<number> {
    return this.genericCount(whereClause);
  }

  async groupBy(by: any, whereClause?: any, orderBy?: any, skip?: number, take?: number): Promise<any> {
    return this.genericGroupBy({by, whereClause, orderBy, skip, take});
  }
}
