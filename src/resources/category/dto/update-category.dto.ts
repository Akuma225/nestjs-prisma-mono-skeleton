import { CreateCategoryDto } from "./create-category.dto";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
