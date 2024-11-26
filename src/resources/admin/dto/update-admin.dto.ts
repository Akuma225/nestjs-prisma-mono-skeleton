import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsString } from "class-validator";
import { AdminProfile } from "src/commons/enums/admin-profile.enum";

export class UpdateAdminDto {
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