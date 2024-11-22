import { ApiProperty } from '@nestjs/swagger';
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
    @ApiProperty({
        description: 'User ID',
        example: '1'
    })
    id: string;

    @IsString()
    @ApiProperty({
        description: 'Activation token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdG9rZW4iOiJhZG1pbiJ9.7x0s2VWt4cQe6s1wLxqXsQJzZ3bZ4e8Fz8ZvQ8bJ0Ks'
    })
    activation_token: string;
}