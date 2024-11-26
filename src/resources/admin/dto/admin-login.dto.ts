import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AdminLoginDto {
    @IsEmail()
    @ApiProperty({
        example: 'johndoe@gmail.com',
    })
    email: string;

    @IsString()
    @ApiProperty({
        example: 'password',
    })
    password: string;
}