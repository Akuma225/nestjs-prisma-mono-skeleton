import { AuditEntity } from './audit.entity';

export class BasicEntity extends AuditEntity {
  id?: string;
  name: string;
  reference?: string;
}
