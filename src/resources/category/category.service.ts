import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { SlugService } from 'src/commons/services/slug.service';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';

@Injectable()
export class CategoryService extends BaseCRUDService<Category> {
  constructor(
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  async create(createCategoryDto: CreateCategoryDto, connectedUserId?: string) {
    const slug = this.slugService.slugify(createCategoryDto.name);

    return this.genericCreate({
      ...createCategoryDto,
      slug
    }, connectedUserId, true);
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll(params);
  }

  findOne(id: string) {
    return this.genericFindOne(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto, connectedUserId?: string) {
    const slug = this.slugService.slugify(updateCategoryDto.name);

    return this.genericUpdate(id, {
      ...updateCategoryDto,
      slug
    }, connectedUserId, true);
  }

  remove(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete(id, connectedUserId);
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore(id, connectedUserId);
  }
}
