import { IsOptional, IsString } from 'class-validator';
import { AuditEntity } from './audit.entity';

export class BasicEntity extends AuditEntity {
  constructor(data) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.reference = data.reference || null;
  }

  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  reference?: string;
}
