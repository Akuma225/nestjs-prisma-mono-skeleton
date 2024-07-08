import { IsOptional, IsString } from 'class-validator';
import { BaseVm } from './base.vm';
import { ApiResponseProperty } from '@nestjs/swagger';

export class CategoryVm extends BaseVm {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || null;
    this.slug = data.slug;
  }

  @IsString()
  @ApiResponseProperty()
  id: string;

  @IsString()
  @ApiResponseProperty()
  name: string;

  @IsString()
  @ApiResponseProperty()
  description?: string;

  @IsString()
  @ApiResponseProperty()
  slug: string;
}
