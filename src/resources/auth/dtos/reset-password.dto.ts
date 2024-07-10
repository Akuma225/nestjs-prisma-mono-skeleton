import { IsString, IsStrongPassword } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class ResetPasswordDTO {
    @IsString()
    @IsDataExists(
        ModelMappingTable.PASSWORD_RESET,
        'id',
        {
            message: 'Aucune requête de réinitialisation de mot de passe trouvée !'
        }
    )
    id: string;

    @IsString()
    token: string;

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
    new_password: string;
}