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

@Injectable()
export class ApplicationService extends BaseCRUDService<ApplicationEntity> {

    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
        private readonly referenceService: ReferenceService
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

        // TODO: Create default configuration for the application

        return app;
    }

    findAll(params?: IPaginationParams, filter?: FilterApplicationDto): Promise<PaginationVm> {
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

        return this.genericFindAll({
            params,
            whereClause,
            orderBy: [
                { created_at: 'desc' }
            ],
            searchables: ['name', 'description', 'reference']
        });
    }

    findOne(id: string): Promise<ApplicationEntity> {
        throw new Error('Method not implemented.');
    }

    update(id: string, data: UpdateApplicationDto, connectedUserId?: string): Promise<ApplicationEntity> {
        return this.genericUpdate({
            id,
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description && { description: data.description }),
                ...(data.is_active !== undefined && { is_active: data.is_active })
            },
            connectedUserId
        });
    }

    delete(id: string): Promise<ApplicationEntity> {
        return this.genericDelete(id);
    }
    softDelete(id: string, connectedUserId?: string): Promise<ApplicationEntity> {
        return this.genericSoftDelete({
            id,
            connectedUserId
        });
    }
    restore(id: string, connectedUserId?: string): Promise<ApplicationEntity> {
        return this.genericRestore({
            id,
            connectedUserId
        });
    }
}
