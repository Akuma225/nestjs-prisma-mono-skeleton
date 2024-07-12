import { Category } from "src/resources/category/entities/category.entity";

export class Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    category: Category;
}
