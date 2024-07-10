import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SlugService } from 'src/commons/services/slug.service';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { CacheInterceptor } from 'src/commons/interceptors/cache.interceptor';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    SlugService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.CATEGORY,
    }
  ],
})
export class CategoryModule { }
