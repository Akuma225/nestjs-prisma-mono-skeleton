import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { RandomService } from 'src/commons/services/random.service';
import { SecurityService } from 'src/commons/services/security.service';

@Module({
  controllers: [AdminController],
  providers: [
    {
      provide: "MODEL_MAPPING",
      useValue: ModelMappingTable.ADMIN
    },
    RandomService,
    SecurityService,
    AdminService,
  ],
})
export class AdminModule {}
