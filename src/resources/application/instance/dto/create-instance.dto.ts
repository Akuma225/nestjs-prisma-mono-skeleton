import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { UpsertInstanceConfigDto } from "./upsert-instance-config.dto";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

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

    @IsDataExists(
        ModelMappingTable.INTERNAL_PROVIDER,
        "id",
        {
            each: true,
            message: "Fournisseur interne inexistant: $value"
        }
    )
    @IsUUID("4", { each: true })
    @IsArray()
    @ApiProperty({
        example: ["f5c4e8e6-8e5b-4e0b-8b4c-4c7c5b0c8e5b"]
    })
    internal_provider_ids: string[];

    @IsDataExists(
        ModelMappingTable.EXTERNAL_PROVIDER,
        "id",
        {
            each: true,
            message: "Fournisseur externe inexistant: $value"
        }
    )
    @IsUUID("4", { each: true })
    @IsArray()
    @ApiProperty({
        example: ["f5c4e8e6-8e5b-4e0b-8b4c-4c7c5b0c8e5b"]
    })
    external_provider_ids: string[];
}