import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { PrismaService } from 'src/commons/services/prisma.service';
import { SlugService } from 'src/commons/services/slug.service';
import { PaginationService } from 'src/commons/services/pagination.service';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';

@Injectable()
export class CategoryService extends BaseCRUDService<Category> {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly paginationService: PaginationService,
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(prismaService, paginationService, modelName);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.slugService.slugify(createCategoryDto.name);

    return this.genericCreate({
      ...createCategoryDto,
      slug,
    });
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll(params);
  }

  findOne(id: string) {
    return this.genericFindOne(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.genericUpdate(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string) {
    return this.genericSoftDelete(id);
  }

  restore(id: string) {
    return this.genericRestore(id);
  }
}
