import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { CategoryVm } from 'src/commons/shared/viewmodels/category.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { Cacheable } from 'src/commons/decorators/cacheable.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 201, type: CategoryVm })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: CustomRequest
  ) {
    return CategoryVm.create(await this.categoryService.create({
      ...createCategoryDto
    }, req.user?.id));
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
  @Cacheable()
  async findOne(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string,
  ) {
    return CategoryVm.create(await this.categoryService.findOne(id));
  }

  @Patch(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: CategoryVm })
  async update(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" })
    id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: CustomRequest
  ) {
    return CategoryVm.create(await this.categoryService.update(id, updateCategoryDto, req.user?.id));
  }

  @Delete(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 204, description: "La catégorie a été définitivement supprimée !" })
  async remove(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string
  ) {
    await this.categoryService.delete(id);

    // Return success message with status code 204
    throw new HttpException("La catégorie a été définitivement supprimée !", HttpStatus.NO_CONTENT);
  }

  @Delete(':id/soft')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: CategoryVm })
  async softDelete(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return CategoryVm.create(await this.categoryService.softDelete(id, req.user?.id));
  }

  @Patch(':id/restore')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: CategoryVm })
  async restore(
    @ParamId({ model: ModelMappingTable.CATEGORY, errorMessage: "La catégorie n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return CategoryVm.create(await this.categoryService.restore(id, req.user?.id));
  }
}
