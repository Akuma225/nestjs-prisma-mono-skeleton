import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";

export class CreateProductDto {
    @IsString()
    @IsUnique(ModelMappingTable.PRODUCT, 'name', {
        message: 'Ce produit existe déjà !'
    })
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    price: number;

    @IsString()
    @IsDataExists(ModelMappingTable.CATEGORY, 'id', {
        message: 'La catégorie n\'existe pas !'
    })
    category_id: string;

    image?: Express.Multer.File;
}
