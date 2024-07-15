import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";
import { Profile } from "src/commons/enums/profile.enum";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'First name',
        example: 'John'
    })
    firstname?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Last name',
        example: 'Doe'
    })
    lastname?: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    @IsUnique(ModelMappingTable.USER, 'email', {
        message: 'Un utilisateur avec cet email existe déjà.'
    })
    @ApiProperty({
        description: 'Email address',
        example: 'johndoe@gmail.com'
    })
    email?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Contact number',
        example: '+33612345678'
    })
    contact?: string;

    @IsString()
    @IsOptional()
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
        description: 'Password',
        example: 'Password@123'
    })
    new_password: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Password',
        example: 'Password@123'
    })
    current_password: string;
}
