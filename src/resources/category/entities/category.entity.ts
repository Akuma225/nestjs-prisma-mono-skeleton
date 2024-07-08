import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class Category extends AuditEntity {
    id: number;
    name: string;
    slug: string;
    description: string;
}
