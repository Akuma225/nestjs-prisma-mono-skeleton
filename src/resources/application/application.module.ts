import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { ReferenceService } from 'src/commons/services/reference.service';
import { ApplicationConfigModule } from './application-config/application-config.module';

@Module({
  imports: [
    ApplicationConfigModule
  ],
  controllers: [ApplicationController],
  providers: [
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.APPLICATION,
    },
    ReferenceService,
    ApplicationService
  ],
})
export class ApplicationModule {}
