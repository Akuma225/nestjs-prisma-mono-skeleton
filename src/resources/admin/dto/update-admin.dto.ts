import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        description: 'Is the admin active?',
        example: true
    })
    is_active: boolean;
}
