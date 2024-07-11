import { IsOptional, IsString } from "class-validator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    @IsUnique(
        ModelMappingTable.CATEGORY,
        'name',
        {
            message: 'Une catégorie avec ce nom existe déjà.'
        },
        ['id']
    )
    name: string;

    @IsString()
    @IsOptional()
    description: string;
}
