import { AuditEntity } from './audit.entity';

export class BasicEntity extends AuditEntity {
  constructor(data) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.reference = data.reference;
  }

  id?: string;
  name: string;
  reference?: string;
}
