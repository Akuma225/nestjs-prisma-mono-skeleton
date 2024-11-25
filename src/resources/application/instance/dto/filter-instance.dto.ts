import { IsUUID } from "class-validator";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class FilterInstanceDto {
    @IsUUID()
    @IsDataExists(
        ModelMappingTable.APPLICATION,
        "id",
        {
            message: "Application inexistante: $value"
        }
    )
    application_id?: string;
}