import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.USER,
    }
  ],
})
export class AdminModule { }
