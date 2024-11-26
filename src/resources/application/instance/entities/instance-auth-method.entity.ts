import { AuditEntity } from "src/commons/shared/entities/audit.entity";
import { InternalProviderEntity } from "./internal-provider.entity";
import { ExternalProviderEntity } from "./external-provider.entity";

export class InstanceAuthMethodEntity extends AuditEntity {
    id: string;
    instance_id: string;
    internal_provider_id: string;
    internal_provider?: InternalProviderEntity;
    external_provider_id: string;
    external_provider?: ExternalProviderEntity;
    is_active: boolean;
}