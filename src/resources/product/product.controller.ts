import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { ProductVm } from 'src/commons/shared/viewmodels/product.vm';

@ApiTags('Product')
@ApiBearerAuth()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @SetProfile(Profile.ADMIN, Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 201, type: ProductVm })
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    console.log(createProductDto);
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
