import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpdateInstanceInternalProviderDto } from "./update-instance-internal-provider.dto";
import { UpdateInstanceExternalProviderDto } from "./update-instance-external-provider.dto";
import { Type } from "class-transformer";

export class UpdateInstanceDto {
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'My Instance', 
    })
    name?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true
    })
    is_active?: boolean;

    @IsArray()
    @IsOptional()
    @ApiProperty({
        example: [
            {
                internal_provider_id: "f5c4e8e6-8e5b-4e0b-8b4c-4c7c5b0c8e5b",
                is_active: true
            }
        ]
    })
    @Type(() => UpdateInstanceInternalProviderDto)
    @ValidateNested({ each: true })
    internal_providers?: UpdateInstanceInternalProviderDto[];

    @IsArray()
    @IsOptional()
    @ApiProperty({
        example: [
            {
                external_provider_id: "f5c4e8e6-8e5b-4e0b-8b4c-4c7c5b0c8e5b",
                is_active: true
            }
        ]
    })
    @Type(() => UpdateInstanceExternalProviderDto)
    @ValidateNested({ each: true })
    external_providers?: UpdateInstanceExternalProviderDto[];
}