import { IsString } from "class-validator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class CreateCategoryDto {
    @IsString()
    @IsUnique(
        ModelMappingTable.CATEGORY,
        'name',
        {
            message: 'Une catégorie avec ce nom existe déjà.'
        }
    )
    name: string;

    @IsString()
    description: string;
}
