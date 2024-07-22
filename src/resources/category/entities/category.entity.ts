import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class CategoryEntity extends AuditEntity {
    id: number;
    name: string;
    slug: string;
    description: string;
}
