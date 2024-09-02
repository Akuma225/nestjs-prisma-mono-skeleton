import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SlugService } from 'src/commons/services/slug.service';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { PrismaService } from 'src/commons/services/prisma.service';

@Module({
  controllers: [CategoryController],
  providers: [
    PrismaService,
    CategoryService,
    SlugService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.CATEGORY,
    }
  ],
})
export class CategoryModule { }
