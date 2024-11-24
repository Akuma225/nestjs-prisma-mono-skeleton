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

@Injectable()
export class ApplicationService extends BaseCRUDService<ApplicationEntity> {

    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
        private readonly referenceService: ReferenceService,
        private readonly appConfigService: ApplicationConfigService
    ) {
        super(modelName);
    }

    async create(data: CreateApplicationDto, connectedUserId?: string): Promise<ApplicationEntity> {
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

        await this.appConfigService.upsertMany(defaultConfigs, connectedUserId);

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
                app_configs: true
            },
            searchables: ['name', 'description', 'reference']
        });

        const apps = response.result.map(app => ({
            ...app,
            app_configs: app.app_configs.map(config => ({
                ...config,
                value: this.appConfigService.parseValue(config.value)
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
                app_configs: true
            }
        });

        const appConfigs = app.app_configs.map(config => ({
            ...config,
            value: this.appConfigService.parseValue(config.value)
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
}
