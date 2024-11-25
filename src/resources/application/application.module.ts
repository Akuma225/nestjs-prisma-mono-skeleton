import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { ReferenceService } from 'src/commons/services/reference.service';
import { RandomService } from 'src/commons/services/random.service';
import { ApplicationConfigService } from './application-config/application-config.service';
import { InstanceService } from './instance/instance.service';
import { PrismaService } from 'src/commons/services/prisma.service';

@Module({
  imports: [],
  controllers: [ApplicationController],
  providers: [
    {
      provide: 'MODEL_MAPPING_INSTANCE',
      useValue: ModelMappingTable.INSTANCE,
    },
    {
      provide: 'MODEL_MAPPING_APPLICATION',
      useValue: ModelMappingTable.APPLICATION,
    },
    {
      provide: 'MODEL_MAPPING_APP_CONFIG',
      useValue: ModelMappingTable.APP_CONFIG,
    },
    ApplicationService,
    ApplicationConfigService,
    InstanceService,
    ReferenceService,
    RandomService,
    PrismaService
  ],
  exports: [
    ApplicationService,
    ApplicationConfigService,
    InstanceService,
  ]
})
export class ApplicationModule {}
