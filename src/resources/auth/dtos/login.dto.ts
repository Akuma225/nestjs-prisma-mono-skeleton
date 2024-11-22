import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDTO {
    @IsString()
    @ApiProperty({
        description: 'Email address',
        example: 'johndoe@gmail.com'
    })
    email: string;

    @IsString()
    @ApiProperty({
        description: 'Password',
        example: 'password'
    })
    password: string;
}