import { CategoryEntity } from "src/resources/category/entities/category.entity";

export class ProductEntity {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    category: CategoryEntity;
}
