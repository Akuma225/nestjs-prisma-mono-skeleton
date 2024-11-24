import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class ApplicationConfigEntity extends AuditEntity {
    id: string;
    application_id?: string;
    key: string;
    value: any;
}