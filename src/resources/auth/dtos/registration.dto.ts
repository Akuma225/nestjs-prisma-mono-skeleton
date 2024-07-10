import { IsEnum, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';
import { IsUniqueMode } from 'src/commons/enums/is_unique_mode.enum';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { Profile } from 'src/commons/enums/profile.enum';

export class RegistrationDTO {
    @IsUnique(
        ModelMappingTable.USER,
        'email',
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
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        },
        {
            message: 'Le mot de passe doit être entre 8 caractères, doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.'
        }
    )
    password: string;
}