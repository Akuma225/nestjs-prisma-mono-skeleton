import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { IsDataExist } from 'src/commons/decorators/is-data-exist.decorator';
import { CategoryVm } from 'src/commons/shared/viewmodels/category.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { CustomRequest } from 'src/commons/interfaces/custom_request';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return CategoryVm.create(await this.categoryService.create(createCategoryDto));
  }

  @Get()
  @Pagination()
  findAll(
    @Req() req: CustomRequest,
  ) {
    return this.categoryService.findAll(req.pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  async update(
    @IsDataExist({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" })
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return CategoryVm.create(await this.categoryService.update(id, updateCategoryDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
