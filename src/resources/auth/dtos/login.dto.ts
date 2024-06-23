import { IsString } from 'class-validator';

export class LoginDTO {
    @IsString()
    email: string;

    @IsString()
    password: string;
}