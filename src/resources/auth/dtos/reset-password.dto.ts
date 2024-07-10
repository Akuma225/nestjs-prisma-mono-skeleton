import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({
        description: 'ID de la requête de réinitialisation de mot de passe',
        example: '1'
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Token de réinitialisation',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdG9rZW4iOiJhZG1pbiJ9.7x0s2VWt4cQe6s1wLxqXsQJzZ3bZ4e8Fz8ZvQ8bJ0Ks'
    })
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
    @ApiProperty({
        description: 'Nouveau mot de passe',
        example: 'password'
    })
    new_password: string;
}