import { IsString } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class ResendResetPasswordOtpDTO {
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
}