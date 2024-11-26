import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class InternalProviderEntity extends AuditEntity {
    id: string;
    label: string;
    property: string;
    is_active: boolean;
}