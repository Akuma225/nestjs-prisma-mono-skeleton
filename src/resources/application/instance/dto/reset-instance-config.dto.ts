import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";

export class ResetInstanceConfigDto {
    @IsEnum(['default', 'application'])
    @IsOptional()
    @ApiProperty({
        example: 'default',
    })
    mode: 'default' | 'application' = 'default';
}