import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus, UseInterceptors, Logger, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { ProductVm } from 'src/commons/shared/viewmodels/product.vm';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { Cacheable } from 'src/commons/decorators/cacheable.decorator';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { FilePath } from 'src/commons/enums/file_path.enum';
import { SingleFileUpload } from 'src/commons/decorators/single-file-upload.decorator';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: ProductVm })
  @SingleFileUpload({
    fieldName: 'image',
    fileType: 'IMAGE',
    fileSizeLimitMB: parseInt(process.env.MULTER_MAX_FILE_SIZE),
    filePathEnum: FilePath.PRODUCT_IMAGE_PATH
  })
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: CustomRequest,
    @UploadedFile() image: Express.Multer.File
  ) {
    return ProductVm.create(await this.productService.create({
      ...createProductDto,
      image
    }, req.user?.id));
  }

  @Get()
  @Pagination()
  @Cacheable()
  @ApiResponse({ status: 200, type: PaginationVm })
  async findAll(
    @Req() req: CustomRequest,
  ) {
    return ProductVm.createPaginated(await this.productService.findAll(req.pagination));
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ProductVm })
  @Cacheable()
  async findOne(
    @ParamId({ model: ModelMappingTable.PRODUCT, errorMessage: "Le produit n'existe pas !" }) id: string
  ) {
    return ProductVm.create(await this.productService.findOne(id));
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @SingleFileUpload({
    fieldName: 'image',
    fileType: 'IMAGE',
    fileSizeLimitMB: parseInt(process.env.MULTER_MAX_FILE_SIZE),
    filePathEnum: FilePath.PRODUCT_IMAGE_PATH
  })
  @ApiResponse({ status: 200, type: ProductVm })
  async update(
    @ParamId({ model: ModelMappingTable.PRODUCT, errorMessage: "Le produit n'existe pas !" })
    id: string,
    @Body() updateCategoryDto: UpdateProductDto,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: CustomRequest
  ) {
    return ProductVm.create(await this.productService.update(id, {
      ...updateCategoryDto,
      image
    }, req.user?.id));
  }

  @Delete(':id')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 204, description: "Le produit a été définitivement supprimée !" })
  async remove(
    @ParamId({ model: ModelMappingTable.PRODUCT, errorMessage: "Le produit n'existe pas !" }) id: string
  ) {
    await this.productService.delete(id);

    // Return success message with status code 204
    throw new HttpException("Le produit a été définitivement supprimée !", HttpStatus.NO_CONTENT);
  }

  @Delete(':id/soft')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: ProductVm })
  async softDelete(
    @ParamId({ model: ModelMappingTable.PRODUCT, errorMessage: "Le produit n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return ProductVm.create(await this.productService.softDelete(id, req.user?.id));
  }

  @Patch(':id/restore')
  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: ProductVm })
  async restore(
    @ParamId({ model: ModelMappingTable.PRODUCT, errorMessage: "Le produit n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return ProductVm.create(await this.productService.restore(id, req.user?.id));
  }
}
