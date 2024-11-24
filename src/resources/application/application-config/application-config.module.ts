import { Module } from "@nestjs/common";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";
import { ApplicationConfigService } from "./application-config.service";
import { PrismaService } from "src/commons/services/prisma.service";

@Module({
    providers: [
      {
        provide: 'MODEL_MAPPING',
        useValue: ModelMappingTable.APP_CONFIG,
      },
      PrismaService,
      ApplicationConfigService
    ],
    exports: [ApplicationConfigService]
  })
  export class ApplicationConfigModule {}