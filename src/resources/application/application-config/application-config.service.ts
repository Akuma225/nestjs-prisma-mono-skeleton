import { Inject, Injectable } from "@nestjs/common";
import { BaseCRUDService } from "src/commons/services/base_crud.service";
import { ApplicationConfigEntity } from "./entities/application-config.entity";
import { IPaginationParams } from "src/commons/interfaces/pagination-params";
import { PaginationVm } from "src/commons/shared/viewmodels/pagination.vm";
import { UpsertApplicationConfigDto } from "./dto/upsert-application-config.dto";
import { PrismaService } from "src/commons/services/prisma.service";
import { AppConfigKey } from "src/commons/enums/app-config-key.enum";
import { formatConfigValue } from "../utils/format-config-value";

@Injectable()
export class ApplicationConfigService extends BaseCRUDService<ApplicationConfigEntity> {

    constructor(
        @Inject('MODEL_MAPPING_APP_CONFIG') modelName: string,
        private readonly prismaService: PrismaService
    ) {
        super(modelName);
    }

    create(data: any, connectedUserId?: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }
    findAll(params?: IPaginationParams, whereClause?: any): Promise<PaginationVm> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }
    update(id: string, data: Partial<any>, connectedUserId?: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }
    softDelete(id: string, connectedUserId?: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }
    restore(id: string, connectedUserId?: string): Promise<ApplicationConfigEntity> {
        throw new Error("Method not implemented.");
    }

    upsert(data: UpsertApplicationConfigDto, connectedUserId?: string): Promise<ApplicationConfigEntity> {
        const formattedValue = formatConfigValue(data.value);
        
        return this.prismaService.app_configs.upsert({
            where: {
                key_application_id: {
                    application_id: data.application_id,
                    key: AppConfigKey[data.key]
                }
            },
            update: {
                value: formattedValue,
                updated_by: connectedUserId
            },
            create: {
                application_id: data.application_id,
                key: AppConfigKey[data.key],
                value: formattedValue,
                created_by: connectedUserId
            }
        });
    }

    upsertMany(data: UpsertApplicationConfigDto[], connectedUserId?: string): Promise<ApplicationConfigEntity[]> {
        let result = [];

        for (const item of data) {
            result.push(this.upsert(item, connectedUserId));
        }

        return Promise.all(result);
    }
}