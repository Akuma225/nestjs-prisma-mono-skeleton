import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpsertInstanceConfigDto } from "./upsert-instance-config.dto";

export class CreateInstanceDto {
    
    @IsUUID()
    @IsOptional()
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    application_id?: string;

    @IsString()
    @ApiProperty({
        example: 'My Instance',
    })
    name: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
    })
    is_active?: boolean;

    @IsOptional()
    @ValidateNested({ each: true })
    @ApiProperty({
        example: [
            {
                key: 'key',
                value: 'value',
            }
        ],
        type: [UpsertInstanceConfigDto]
    })
    configs?: UpsertInstanceConfigDto[];
}