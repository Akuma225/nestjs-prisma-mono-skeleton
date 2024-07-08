import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { PrismaService } from 'src/commons/services/prisma.service';
import { SlugService } from 'src/commons/services/slug.service';

@Injectable()
export class CategoryService extends BaseCRUDService<Category> {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly slugService: SlugService,
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(prismaService, modelName);
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.slugService.slugify(createCategoryDto.name);

    return this.genericCreate({
      ...createCategoryDto,
      slug,
    });
  }

  findAll() {
    return this.genericFindAll();
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
}
