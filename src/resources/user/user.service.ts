import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseCRUDService } from 'src/commons/services/base_crud.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserMapper } from './mappers/update-user.mapper';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService extends BaseCRUDService<UserEntity> {
    constructor(
        @Inject('MODEL_MAPPING') modelName: string,
    ) {
        super(modelName);
    }

    async updateProfile(id: string, updateUserDto: UpdateUserDto, connectedUserId?: string) {
        let password = undefined;

        if (updateUserDto.current_password && updateUserDto.new_password) {
            const user = await this.genericFindOne(id);
            // Check if the current password is correct
            const isPasswordMatch = await bcrypt.compare(updateUserDto.current_password, user.password);

            if (!isPasswordMatch) {
                throw new HttpException('Le mot de passe actuel est incorrect', HttpStatus.BAD_REQUEST);
            }

            password = await bcrypt.hash(updateUserDto.new_password, 10);
        }

        const oUser = new UpdateUserMapper({
            ...updateUserDto,
            password
        });

        return this.genericUpdate(id, oUser, connectedUserId);
    }

    getProfile(id: string) {
        return this.genericFindOne(id);
    }
}
