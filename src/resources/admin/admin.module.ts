import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { RandomService } from 'src/commons/services/random.service';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: "MODEL_MAPPING",
      useValue: ModelMappingTable.ADMIN
    },
    AdminService,
    RandomService
  ],
})
export class AdminModule {}
