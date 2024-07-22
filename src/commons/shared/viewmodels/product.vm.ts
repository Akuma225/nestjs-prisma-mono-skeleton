import { ApiResponseProperty } from "@nestjs/swagger";
import { BaseVm } from "./base.vm";
import { CategoryVm } from "./category.vm";
import { FilePath } from "src/commons/enums/file_path.enum";

export class ProductVm extends BaseVm {
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    name: string;

    @ApiResponseProperty()
    slug: string;

    @ApiResponseProperty()
    description: string;

    @ApiResponseProperty()
    price: number;

    @ApiResponseProperty()
    image: string;

    @ApiResponseProperty()
    category: CategoryVm;

    constructor(data) {
        super(data);
        this.id = data.id;
        this.name = data.name;
        this.slug = data.slug;
        this.description = data.description;
        this.price = data.price;
        this.image = data.image ? `${process.env.APP_BASE_URL}${FilePath.PRODUCT_IMAGE_PATH}${data.image}` : null;
        this.category = new CategoryVm(data.category);
    }
}
