import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from "class-validator";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class CreateApplicationDto {
    @IsString()
    @ApiProperty({
        example: "My Application"
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: "lorem ipsum"
    })
    description?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
        required: false
    })
    is_active?: boolean;

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