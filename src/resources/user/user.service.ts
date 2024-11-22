import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from "bcrypt"
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';

@Injectable()
export class UserService extends BaseCRUDService<UserEntity> {
    create(data: any, connectedUserId?: string, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    findAll(params?: IPaginationParams, whereClause?: any, include?: any, select?: any, orderBy?: any[]): Promise<PaginationVm> {
        throw new Error('Method not implemented.');
    }
    findOne(id: string, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    findOneBy(whereClause: any, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    update(id: string, data: Partial<any>, connectedUserId?: string, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    delete(id: string): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    softDelete(id: string, connectedUserId?: string, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    restore(id: string, connectedUserId?: string, include?: any, select?: any): Promise<UserEntity> {
        throw new Error('Method not implemented.');
    }
    count(whereClause?: any): Promise<number> {
        throw new Error('Method not implemented.');
    }
    groupBy(by: any, whereClause?: any, orderBy?: any, skip?: number, take?: number): Promise<any> {
        throw new Error('Method not implemented.');
    }
    
    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
    ) {
        super(modelName);
    }
}
