import { IsOptional, IsString } from 'class-validator';
import { IsForeignKeyExists } from 'src/commons/decorators/is-foreign-key-exists.decorator';
import { IsUnique } from 'src/commons/decorators/is-unique.decorator';

export class LoginDTO {
    @IsString()
    @IsUnique('users', 'email', {
        message: "Un utilisateur avec cet email existe déjà."
    })
    email: string;

    @IsString()
    password: string;

    // This property is for testing purposes
    @IsOptional()
    @IsString()
    @IsForeignKeyExists('users', 'id', {
        message: "L'utilisateur n'existe pas."
    })
    userId: string;
}