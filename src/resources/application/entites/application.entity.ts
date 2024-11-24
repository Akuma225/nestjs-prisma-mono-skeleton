import { AuditEntity } from "src/commons/shared/entities/audit.entity";
import { ApplicationConfigEntity } from "../application-config/entities/application-config.entity";

export class ApplicationEntity extends AuditEntity {
    id: string;
    name: string;
    reference: string;
    description?: string;
    is_active: boolean;
    app_configs: ApplicationConfigEntity[];
}