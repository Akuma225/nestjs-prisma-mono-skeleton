import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsDataExists } from 'src/commons/decorators/is-data-exists.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

export class ConfirmResetPasswordDTO {
    @IsString()
    @IsDataExists(
        ModelMappingTable.PASSWORD_RESET,
        'id',
        {
            message: 'Aucune requête de réinitialisation de mot de passe trouvée !'
        }
    )
    @ApiProperty({
        description: 'Password reset request ID',
        example: '1'
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Reset token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdG9rZW4iOiJhZG1pbiJ9.7x0s2VWt4cQe6s1wLxqXsQJzZ3bZ4e8Fz8ZvQ8bJ0Ks'
    })
    token: string;

    @IsString()
    @ApiProperty({
        description: 'New password',
        example: 'password'
    })
    code: string;
}