import { ApiProperty } from "@nestjs/swagger";

import { IsBoolean, IsOptional, IsUUID } from "class-validator";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class UpdateInstanceInternalProviderDto {

    @IsDataExists(
        ModelMappingTable.INTERNAL_PROVIDER,
        "id",
        {
            message: "Fournisseur interne inexistant: $value"
        }
    )
    @IsUUID()
    @ApiProperty({
        example: "f5c4e8e6-8e5b-4e0b-8b4c-4c7c5b0c8e5b"
    })
    internal_provider_id: string;
    
    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true
    })
    is_active: boolean;
}