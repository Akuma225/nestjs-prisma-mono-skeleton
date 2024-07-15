import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { User } from '../user/entities/user.entity';
import { CreateAdminMapper } from './mappers/create-admin.mapper';
import { IPaginationParams } from 'src/commons/interfaces/pagination-params';
import { Profile } from 'src/commons/enums/profile.enum';
import * as bcrypt from "bcrypt"
import { UpdateAdminMapper } from './mappers/update-admin.mapper';

@Injectable()
export class AdminService extends BaseCRUDService<User> {
  constructor(
    @Inject('MODEL_MAPPING') modelName: string,
  ) {
    super(modelName);
  }

  async create(createAdminDto: CreateAdminDto, connectedUserId?: string) {
    const oAdmin = new CreateAdminMapper({
      ...createAdminDto,
      is_active: true,
      is_first_login: true,
      mail_verified_at: new Date(),
      password: await bcrypt.hash(createAdminDto.password, 10),
    });

    const createdUser = await this.genericCreate(oAdmin, connectedUserId);

    // Send email with password to the user

    return createdUser;
  }

  findAll(params?: IPaginationParams | undefined) {
    return this.genericFindAll(params, {
      profile: {
        in: [Profile.ADMIN, Profile.SUPER_ADMIN]
      }
    });
  }

  findOne(id: string) {
    return this.genericFindOne(id);
  }

  async update(id: string, updateAdminDto: UpdateAdminDto, connectedUserId?: string) {
    const oAdmin = new UpdateAdminMapper({
      ...updateAdminDto,
      password: updateAdminDto.password ? await bcrypt.hash(updateAdminDto.password, 10) : undefined,
      is_first_login: updateAdminDto.password ? true : undefined
    });

    const updatedAdmin = await this.genericUpdate(id, oAdmin, connectedUserId);

    // Send email with password to the user if password has been updated
    if (updateAdminDto.password) {
      // Send email

    }

    // Send email if is_active has been updated
    if (updateAdminDto.is_active !== undefined) {
      // Send email
    }

    return updatedAdmin;
  }

  remove(id: string) {
    return this.genericDelete(id);
  }

  softDelete(id: string, connectedUserId?: string) {
    return this.genericSoftDelete(id, connectedUserId);
  }

  restore(id: string, connectedUserId?: string) {
    return this.genericRestore(id, connectedUserId);
  }
}
