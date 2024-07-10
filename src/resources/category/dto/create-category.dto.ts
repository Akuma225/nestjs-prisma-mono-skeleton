import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
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
    @ApiProperty({
        description: 'Category name',
        example: 'Category 1'
    })
    name: string;

    @IsString()
    @ApiProperty({
        description: 'Category description',
        example: 'Category 1 description'
    })
    description: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'Category created by',
        example: 'admin'
    })
    created_by?: string;
}
