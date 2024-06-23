import { IsDate, IsString } from 'class-validator';

export class AuditEntity {
  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  deleted_at: Date;

  @IsString()
  created_by: string;

  @IsString()
  updated_by: string;

  @IsString()
  deleted_by: string;
}
