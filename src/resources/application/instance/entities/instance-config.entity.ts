import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class InstanceConfigEntity extends AuditEntity {
    id: string;
    instance_id?: string;
    key: string;
    value: any;
}