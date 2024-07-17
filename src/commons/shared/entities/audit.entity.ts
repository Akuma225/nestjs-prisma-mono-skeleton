import { IsDate, IsString } from 'class-validator';

export class AuditEntity {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
}
