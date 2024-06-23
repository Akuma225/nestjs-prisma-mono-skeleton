import { IsOptional, IsString } from 'class-validator';
import { BaseVm } from './base.vm';

export class BasicVm extends BaseVm {
  constructor(data) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.reference = data.reference || null;
  }

  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
