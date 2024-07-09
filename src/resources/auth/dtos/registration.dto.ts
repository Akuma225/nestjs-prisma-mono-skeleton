import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { IsUniqueMode } from 'src/commons/enums/is_unique_mode.enum';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { Profile } from 'src/commons/enums/profile.enum';

export class RegistrationDTO {
    @IsUnique(
        ModelMappingTable.USER,
        'email',
        IsUniqueMode.INSENSITIVE,
        {
            message: 'Un compte existe déjà avec cette adresse email !'
        }
    )
    @IsString()
    email: string;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsString()
    @IsOptional()
    contact?: string;

    @IsEnum(Profile)
    profile: string;

    @IsString()
    password: string;
}