import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { CategoryVm } from 'src/commons/shared/viewmodels/category.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { Cacheable } from 'src/commons/decorators/cacheable.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @ApiResponse({ status: 201, type: CategoryVm })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return CategoryVm.create(await this.categoryService.create(createCategoryDto));
  }

  @Get()
  @Pagination()
  @Cacheable()
  @ApiResponse({ status: 200, type: PaginationVm })
  async findAll(
    @Req() req: CustomRequest,
  ) {
    return CategoryVm.createPaginated(await this.categoryService.findAll(req.pagination));
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: CategoryVm })
  async findOne(@Param('id') id: string) {
    return CategoryVm.create(await this.categoryService.findOne(id));
  }

  @Patch(':id')
  @ApiResponse({ status: 200, type: CategoryVm })
  async update(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" })
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return CategoryVm.create(await this.categoryService.update(id, updateCategoryDto));
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: "La catégorie a été définitivement supprimée !" })
  async remove(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    await this.categoryService.remove(id);

    // Return success message with status code 204
    throw new HttpException("La catégorie a été définitivement supprimée !", HttpStatus.NO_CONTENT);
  }

  @Delete(':id/soft')
  @ApiResponse({ status: 200, type: CategoryVm })
  async softDelete(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    return await this.categoryService.softDelete(id);
  }

  @Patch(':id/restore')
  @ApiResponse({ status: 200, type: CategoryVm })
  async restore(@ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string) {
    return CategoryVm.create(await this.categoryService.restore(id));
  }
}
