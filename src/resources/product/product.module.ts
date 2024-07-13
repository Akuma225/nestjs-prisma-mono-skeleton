import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { SlugService } from 'src/commons/services/slug.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    SlugService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.PRODUCT,
    }
  ],
})
export class ProductModule { }
