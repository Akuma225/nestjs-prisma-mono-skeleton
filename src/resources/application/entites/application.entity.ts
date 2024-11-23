import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class ApplicationEntity extends AuditEntity {
    id: string;
    name: string;
    reference: string;
    description?: string;
    is_active: boolean;
}