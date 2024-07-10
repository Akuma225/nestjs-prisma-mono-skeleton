import { IsString } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class RequestResetPasswordDTO {
    @IsString()
    @IsDataExists(
        ModelMappingTable.USER,
        'email',
        { message: 'Cet email n\'existe pas dans la base de données.' }
    )
    email: string;
}