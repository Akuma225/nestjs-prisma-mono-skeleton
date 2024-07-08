import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PrismaService } from 'src/commons/services/prisma.service';
import { SlugService } from 'src/commons/services/slug.service';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

@Module({
  controllers: [CategoryController],
  providers: [
    CategoryService,
    PrismaService,
    SlugService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.CATEGORY,
    },
  ],
})
export class CategoryModule { }
