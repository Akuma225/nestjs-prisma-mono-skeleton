import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { AdminProfile } from "src/commons/enums/admin-profile.enum";

export class FilterAdminDto {
    @IsEnum(AdminProfile)
    @IsOptional()
    @ApiProperty({
        example: AdminProfile.SUPER_ADMIN
    })
    profile?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true
    })
    is_active?: boolean;
}