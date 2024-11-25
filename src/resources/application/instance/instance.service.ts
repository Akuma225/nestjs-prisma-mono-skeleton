import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BaseCRUDService } from "src/commons/services/base_crud.service";
import { IPaginationParams } from "src/commons/interfaces/pagination-params";
import { PaginationVm } from "src/commons/shared/viewmodels/pagination.vm";
import { PrismaService } from "src/commons/services/prisma.service";
import { InstanceEntity } from "./entities/instance.entity";
import { CreateInstanceDto } from "./dto/create-instance.dto";
import { ReferenceService } from "src/commons/services/reference.service";
import { ModelMappingPrefix } from "src/commons/enums/model-mapping.enum";
import { RandomService } from "src/commons/services/random.service";
import { DefaultAppConfigs } from "src/commons/constants/default-app-configs";
import { AppConfigKey } from "src/commons/enums/app-config-key.enum";
import { formatConfigValue } from "../utils/format-config-value";
import { parseConfigValue } from "../utils/parse-config-value";

@Injectable()
export class InstanceService extends BaseCRUDService<InstanceEntity> {

    constructor(
        @Inject('MODEL_MAPPING_INSTANCE') modelName: string,
        private readonly prismaService: PrismaService,
        private readonly referenceService: ReferenceService,
        private readonly randomService: RandomService,
    ) {
        super(modelName);
    }

    async create(data: CreateInstanceDto, connectedUserId?: string): Promise<InstanceEntity> {
        
        if (!data.application_id) {
            throw new HttpException("L'application est obligatoire", HttpStatus.BAD_REQUEST);
        }
        
        // Generate instance reference
        const instanceReference = await this.referenceService.generate(ModelMappingPrefix.INSTANCE);

        const { apiKey, apiSecret } = await this.generatePairApiAndSecret();
        const { accessTokenKey, refreshTokenKey } = this.generatePairAccessAndRefreshTokenKeys();

        const instanceData = {
            name: data.name,
            reference: instanceReference,
            is_active: data.is_active,
            api_key: apiKey,
            secret_key: apiSecret,
            access_token_key: accessTokenKey,
            refresh_token_key: refreshTokenKey,
            application: {
                connect: {
                    id: data.application_id,
                },
            },
        }

        const createdInstance = await this.genericCreate({ data: instanceData });

        // Generate default configurations for the instance based on the application configurations. If no configurations are provided, use the default configurations.
        const instanceConfigs = data.configs ? data.configs.map(config => ({
            instance_id: createdInstance.id,
            key: AppConfigKey[config.key],
            value: formatConfigValue(config.value),
        })) : DefaultAppConfigs.map(config => ({
            instance_id: createdInstance.id,
            key: AppConfigKey[config.key],
            value: formatConfigValue(config.value),
        }));

        await this.prismaService.instance_configs.createMany({
            data: instanceConfigs,
        });

        return await this.findOne(createdInstance.id);
    }
    findAll(params?: IPaginationParams, whereClause?: any): Promise<PaginationVm> {
        throw new Error("Method not implemented.");
    }
    async findOne(id: string): Promise<InstanceEntity> {
        const instance = await this.genericFindOne({     
            id,
            include: {
                instance_configs: true,
                application: true,
            }
        });

        const configs = instance.instance_configs.map(config => ({
            ...config,
            value: parseConfigValue(config.value)
        }));

        return {
            ...instance,
            instance_configs: configs
        }
    }
    update(id: string, data: Partial<any>, connectedUserId?: string): Promise<InstanceEntity> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<InstanceEntity> {
        throw new Error("Method not implemented.");
    }
    softDelete(id: string, connectedUserId?: string): Promise<InstanceEntity> {
        throw new Error("Method not implemented.");
    }
    restore(id: string, connectedUserId?: string): Promise<InstanceEntity> {
        throw new Error("Method not implemented.");
    }

    /**
     * Generate API key and secret for the instance and check if it is unique. If not, regenerate it recursively.
     */
    async generatePairApiAndSecret(): Promise<{ apiKey: string, apiSecret: string }> {
        const API_KEY_LENGTH = 24;
        const SECRET_KEY_LENGTH = 48;

        const apiKey = this.randomService.randomToken(API_KEY_LENGTH);
        const apiSecret = this.randomService.randomToken(SECRET_KEY_LENGTH);
        const instance = await this.genericFindOneBy({
            whereClause: {
                api_key: apiKey,
                secret_key: apiSecret,
            },
        });

        if (instance) {
            return this.generatePairApiAndSecret();
        }

        return {
            apiKey,
            apiSecret,
        };
    }

    generatePairAccessAndRefreshTokenKeys(): { accessTokenKey: string, refreshTokenKey: string } {
        const ACCESS_TOKEN_KEY_LENGTH = 33;
        const REFRESH_TOKEN_KEY_LENGTH = 29;

        const accessTokenKey = this.randomService.randomToken(ACCESS_TOKEN_KEY_LENGTH);
        const refreshTokenKey = this.randomService.randomToken(REFRESH_TOKEN_KEY_LENGTH);

        return {
            accessTokenKey,
            refreshTokenKey,
        };
    }
}