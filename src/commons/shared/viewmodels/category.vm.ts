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

  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  description?: string;

  @ApiResponseProperty()
  slug: string;
}
