import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminProfile } from 'src/commons/enums/admin-profile.enum';
import { RandomService } from 'src/commons/services/random.service';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { FilterAdminDto } from './dto/filter-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminData } from 'src/commons/shared/entities/admin-data.entity';
import { SecurityService } from 'src/commons/services/security.service';
import { TokenPair } from 'src/commons/shared/entities/token_pair.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService extends BaseCRUDService<AdminEntity> {
    constructor(
        @Inject("MODEL_MAPPING") modelName: string,
        private readonly randomService: RandomService,
        private readonly securityService: SecurityService
    ) {
        super(modelName);
    }

    async create(data: CreateAdminDto, connectedUserId?: string) {
        let password = this.randomService.randomToken(8);

        const createdAdmin = {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            profile: AdminProfile[data.profile],
            is_active: data.is_active,
            password: password,
        }

        const admin = await this.genericCreate({
            data: createdAdmin,
            connectedUserId
        });

        // Send email to the admin with the password

        return admin;
    }

    async update(id: string, data: UpdateAdminDto, connectedUserId?: string) {
        const updatedAdmin = {
            ...(data.firstname && { firstname: data.firstname }),
            ...(data.lastname && { lastname: data.lastname }),
            ...(data.profile && { profile: AdminProfile[data.profile] }),
            ...(data.is_active !== undefined && { is_active: data.is_active }),
        }

        return this.genericUpdate({
            id,
            data: updatedAdmin,
            connectedUserId
        });
    }

    async findAll(params?: IPaginationParams, filter?: FilterAdminDto) {
        let where: any = {};

        if (filter?.profile) {
            where.profile = AdminProfile[filter.profile];
        }

        return this.genericFindAll({
            params,
            whereClause: where,
            orderBy: [
                { created_at: "desc"}
            ],
            searchables: ['firstname', 'lastname', 'email']
        });
    }

    async softDelete(id: string, connectedUserId?: string) {
        return this.genericSoftDelete({
            id,
            connectedUserId
        });
    }

    async restore(id: string, connectedUserId?: string) {
        return this.genericRestore({
            id,
            connectedUserId
        });
    }

    async login(data: AdminLoginDto) {
        const foundedUser = await this.validateLogin(data);

        // Update last login date and auto login token

        const connectedUser = await this.genericUpdate({
            id: foundedUser.id,
            data: {
                last_login_at: new Date(),
                auto_login_token: this.randomService.randomToken(32)
            }
        })

        // Generate access and refresh tokens
        return this.generateAdminTokenPair(new AdminData(connectedUser));
    }

    generateAdminTokenPair(admin: AdminData): TokenPair {
        const accessTokenData = {
            id: admin.id,
            email: admin.email,
            profile: admin.profile,
            is_active: admin.is_active,
            auto_login_token: admin.auto_login_token,
            firstname: admin.firstname,
            lastname: admin.lastname,
            last_login_at: admin.last_login_at,
            email_verified_at: admin.email_verified_at,
            created_at: admin.created_at,
            updated_at: admin.updated_at,
            deleted_at: admin.deleted_at
        }

        const refreshTokenData = {
            id: admin.id,
            auto_login_token: admin.auto_login_token
        }

        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const accessTokenTTL = process.env.ACCESS_TOKEN_EXPIRE;   
        const accessToken = this.securityService.signJwt(accessTokenData, accessTokenSecret, accessTokenTTL);

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const refreshTokenTTL = process.env.REFRESH_TOKEN_EXPIRE;
        const refreshToken = this.securityService.signJwt(refreshTokenData, refreshTokenSecret, refreshTokenTTL);

        return new TokenPair({
            access_token: accessToken,
            refresh_token: refreshToken
        });
    }

    async validateLogin(data: AdminLoginDto) {
        const user = await this.genericFindOneBy({
            whereClause: {
                email: data.email
            }
        });

        if (!user) {
            Logger.error(`Admin with email ${data.email} not found`);
            throw new HttpException("Adresse ou mot de passe invalide", HttpStatus.UNAUTHORIZED);
        }

        if (!user.is_active) {
            Logger.error(`Admin with email ${data.email} is not active`);
            throw new HttpException("Votre compte a été désactivé", HttpStatus.FORBIDDEN);
        }

        if (!bcrypt.compareSync(data.password, user.password)) {
            Logger.error(`Admin with email ${data.email} has invalid password`);
            throw new HttpException("Adresse ou mot de passe invalide", HttpStatus.UNAUTHORIZED);
        }

        return user;
    }
}
