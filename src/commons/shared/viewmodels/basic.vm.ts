import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseVm } from './base.vm';

export class BasicVm extends BaseVm {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.reference = data.reference;
  }

  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty()
  reference?: string;
}
