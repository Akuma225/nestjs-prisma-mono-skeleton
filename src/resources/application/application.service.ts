import { Inject, Injectable } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { ApplicationEntity } from './entites/application.entity';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { ReferenceService } from 'src/commons/services/reference.service';
import { ModelMappingPrefix } from 'src/commons/enums/model-mapping.enum';
import { CreateApplicationDto } from './dto/create-application.dto';
import { FilterApplicationDto } from './dto/filter-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DefaultAppConfigs } from 'src/commons/constants/default-app-configs';
import { ApplicationConfigService } from './application-config/application-config.service';
import { UpdateApplicationConfigDto } from './dto/update-application-config.dto';
import { InstanceService } from './instance/instance.service';
import { parseConfigValue } from './utils/parse-config-value';

@Injectable()
export class ApplicationService extends BaseCRUDService<ApplicationEntity> {

    constructor(
        @Inject('MODEL_MAPPING_APPLICATION') modelName: string,
        private readonly referenceService: ReferenceService,
        private readonly appConfigService: ApplicationConfigService,
        private readonly instanceService: InstanceService
    ) {
        super(modelName);
    }

    async create(data: CreateApplicationDto, connectedUserId?: string): Promise<ApplicationEntity> {
        const INSTANCE_DEFAULT_NAME = 'default';

        const reference = await this.referenceService.generate(ModelMappingPrefix.APPLICATION);
        
        const app = await this.genericCreate({
            data: {
                ...data,
                reference
            },
            connectedUserId
        });

        const defaultConfigs = DefaultAppConfigs.map(config => ({
            application_id: app.id,
            key: config.key,
            value: config.value
        }));

        // Create default configurations for the application
        const configs = await this.appConfigService.upsertMany(defaultConfigs, connectedUserId);

        // Create a default instance for the application
        await this.instanceService.create({
            application_id: app.id,
            name: INSTANCE_DEFAULT_NAME,
            is_active: app.is_active,
            configs: configs.map(config => ({
                key: config.key,
                value: config.value
            }))
        }, connectedUserId);

        return await this.findOne(app.id);
    }

    async findAll(params?: IPaginationParams, filter?: FilterApplicationDto): Promise<PaginationVm> {
        let whereClause: any = {};

        if (filter?.is_active !== undefined) {
            whereClause = {
                ...whereClause,
                is_active: filter.is_active
            };
        }

        if (filter?.from_created_at && filter?.to_created_at) {
            whereClause = {
                ...whereClause,
                created_at: {
                    $gte: filter.from_created_at,
                    $lte: filter.to_created_at
                }
            };
        }

        const response = await this.genericFindAll({
            params,
            whereClause,
            orderBy: [
                { created_at: 'desc' }
            ],
            include: {
                app_configs: true,
                instances: true
            },
            searchables: ['name', 'description', 'reference']
        });

        const apps = response.result.map(app => ({
            ...app,
            app_configs: app.app_configs.map(config => ({
                ...config,
                value: parseConfigValue(config.value)
            }))
        }));

        return {
            ...response,
            result: apps
        };
    }

    async findOne(id: string): Promise<ApplicationEntity> {
        const app = await this.genericFindOne({     
            id,
            include: {
                app_configs: true,
                instances: true
            }
        });

        const appConfigs = app.app_configs.map(config => ({
            ...config,
            value: parseConfigValue(config.value)
        }));

        return {
            ...app,
            app_configs: appConfigs
        }
    }

    async update(id: string, data: UpdateApplicationDto, connectedUserId?: string): Promise<ApplicationEntity> {
        await this.genericUpdate({
            id,
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description && { description: data.description }),
                ...(data.is_active !== undefined && { is_active: data.is_active })
            },
            connectedUserId
        });

        return this.findOne(id);
    }

    delete(id: string): Promise<ApplicationEntity> {
        return this.genericDelete(id);
    }
    async softDelete(id: string, connectedUserId?: string): Promise<ApplicationEntity> {
        await this.genericSoftDelete({
            id,
            connectedUserId
        });

        return this.findOne(id);
    }
    async restore(id: string, connectedUserId?: string): Promise<ApplicationEntity> {
        await this.genericRestore({
            id,
            connectedUserId
        });

        return this.findOne(id);
    }
    async updateConfigs(id: string, data: UpdateApplicationConfigDto, connectedUserId?: string): Promise<ApplicationEntity> {
        await this.appConfigService.upsertMany(
            data.configs.map(config => ({
                ...config,
                application_id: id
            }), 
            connectedUserId
        ), connectedUserId);

        // TODO: Apply the configuration on the instances

        return this.findOne(id);
    }

    async resetConfigs(id: string, connectedUserId?: string): Promise<ApplicationEntity> {
        const defaultConfigs = DefaultAppConfigs.map(config => ({
            application_id: id,
            key: config.key,
            value: config.value
        }));

        await this.appConfigService.upsertMany(defaultConfigs, connectedUserId);

        return this.findOne(id);
    }
}
