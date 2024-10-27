import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import { FileUploadProperty } from "src/commons/decorators/file-upload-property.decorator";
import { IsDataExists } from "src/commons/decorators/is-data-exists.decorator";
import { IsUnique } from "src/commons/decorators/is-unique.decorator";
import { FilePath } from "src/commons/enums/file_path.enum";
import { ModelMappingTable } from "src/commons/enums/model-mapping.enum";
import { SupportedTypesFile } from "src/commons/enums/supported-types-file.enum";

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

    @FileUploadProperty({
        fieldName: 'image',
        fileType: SupportedTypesFile.IMAGE, // Types de fichier autorisés
        fileSizeLimitMB: parseInt(process.env.MULTER_MAX_FILE_SIZE),
        filePathEnum: FilePath.PRODUCT_IMAGE_PATH
    })
    image?: Express.Multer.File;
}
