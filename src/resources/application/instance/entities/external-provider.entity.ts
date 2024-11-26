import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class ExternalProviderEntity extends AuditEntity {
    id: string;
    label: string;
    code: string;
    is_active: boolean;
}