import { Inject, Injectable } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminProfile } from 'src/commons/enums/admin-profile.enum';
import { RandomService } from 'src/commons/services/random.service';

@Injectable()
export class AdminService extends BaseCRUDService<AdminEntity> {
    constructor(
        @Inject("MODEL_MAPPING") modelName: string,
        private readonly randomService: RandomService,
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
}
