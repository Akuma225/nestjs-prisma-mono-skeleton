import { IsString } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class ResetActivationOtpDTO {
    @IsString()
    @IsDataExists(
        ModelMappingTable.USER,
        'id',
        {
            message: 'Aucun compte trouvé avec cet identifiant !'
        }
    )
    id: string;

    @IsString()
    activation_token: string;
}