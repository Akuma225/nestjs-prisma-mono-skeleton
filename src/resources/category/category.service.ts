import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { SlugService } from 'src/commons/services/slug.service';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';

@Injectable()
export class CategoryService extends BaseCRUDService<CategoryEntity> {
  constructor(
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  create(createCategoryDto: CreateCategoryDto, connectedUserId?: string) {
    const slug = this.slugService.slugify(createCategoryDto.name);

    return this.genericCreate({
      ...createCategoryDto,
      slug
    }, connectedUserId);
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll(params);
  }

  findOne(id: string) {
    return this.genericFindOne(id);
  }

  findOneBy(whereClause: any, include?: any, select?: any): Promise<CategoryEntity> {
    return this.genericFindOneBy(whereClause, include, select);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, connectedUserId?: string) {
    let slug = updateCategoryDto.name ? this.slugService.slugify(updateCategoryDto.name) : undefined;

    return this.genericUpdate(id, {
      ...updateCategoryDto,
      slug
    }, connectedUserId);
  }

  delete(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete(id, connectedUserId);
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore(id, connectedUserId);
  }
}
