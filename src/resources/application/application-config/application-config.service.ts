import { Inject, Injectable } from "@nestjs/common";
import { BaseCRUDService } from "src/commons/services/base_crud.service";
import { ApplicationConfigEntity } from "./entities/application-config.entity";
import { IPaginationParams } from "src/commons/interfaces/pagination-params";
import { PaginationVm } from "src/commons/shared/viewmodels/pagination.vm";
import { UpsertApplicationConfigDto } from "./dto/upsert-application-config.dto";
import { PrismaService } from "src/commons/services/prisma.service";
import { AppConfigKey } from "src/commons/enums/app-config-key.enum";
import { isBooleanString, isNumberString, isObject } from "class-validator";

@Injectable()
export class ApplicationConfigService extends BaseCRUDService<ApplicationConfigEntity> {

    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
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
        const formattedValue = this.formatValue(data.value);
        
        return this.prismaService.app_configs.upsert({
            where: {
                id: data.application_id
            },
            update: {
                key: AppConfigKey[data.key],
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

    parseValue(value: string) {
        if (isBooleanString(value)) {
            return value === 'true';
        }

        if (isNumberString(value)) {
            return parseInt(value);
        }

        if (isObject(value)) {
            return JSON.parse(value);
        }

        return value;
    }

    formatValue(value: any) {
        if (typeof value === 'boolean' || typeof value === 'number') {
            return value.toString();
        }

        if (isObject(value)) {
            return JSON.stringify(value);
        }

        return value;
    }
}