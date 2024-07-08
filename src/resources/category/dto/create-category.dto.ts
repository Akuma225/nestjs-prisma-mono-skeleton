import { IsString } from "class-validator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { IsUniqueMode } from "src/commons/enums/is_unique_mode.enum";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class CreateCategoryDto {
    @IsString()
    @IsUnique(ModelMappingTable.CATEGORY, 'name', IsUniqueMode.INSENSITIVE, {
        message: 'Une catégorie avec ce nom existe déjà.'
    })
    name: string;

    @IsString()
    description: string;
}
