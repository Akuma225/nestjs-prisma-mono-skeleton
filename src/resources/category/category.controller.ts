import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { CategoryVm } from 'src/commons/shared/viewmodels/category.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { ParamId } from 'src/commons/decorators/param-id.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return CategoryVm.create(await this.categoryService.create(createCategoryDto));
  }

  @Get()
  @Pagination()
  async findAll(
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.createPaginated(await this.categoryService.findAll(req.pagination));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return CategoryVm.create(await this.categoryService.findOne(id));
  }

  @Patch(':id')
  async update(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" })
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return CategoryVm.create(await this.categoryService.update(id, updateCategoryDto));
  }

  @Delete(':id')
  async remove(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    await this.categoryService.remove(id);

    // Return success message with status code 204
    throw new HttpException("La catégorie a été définitivement supprimée !", HttpStatus.NO_CONTENT);
  }

  @Delete(':id/soft')
  async softDelete(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    return await this.categoryService.softDelete(id);
  }

  @Patch(':id/restore')
  async restore(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    return CategoryVm.create(await this.categoryService.restore(id));
  }
}
