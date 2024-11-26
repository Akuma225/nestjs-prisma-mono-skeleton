import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { AdminProfile } from "src/commons/enums/admin-profile.enum";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class CreateAdminDto {
    @IsString()
    @ApiProperty({
        example: 'John',
    })
    firstname: string;
    
    @IsString()
    @ApiProperty({
        example: 'Doe',
    })
    lastname: string;

    @IsEmail()
    @IsUnique(
        ModelMappingTable.ADMIN,
        'email',
        { message: "Un admin avec cet email existe déjà !" }
    )
    @ApiProperty({
        example: 'johndoe@gmail.com'
    })
    email: string;

    @IsEnum(AdminProfile)
    @ApiProperty({
        example: AdminProfile.SUPER_ADMIN
    })
    profile: string;

    @IsBoolean()
    @ApiProperty({
        example: true
    })
    is_active: boolean;
}