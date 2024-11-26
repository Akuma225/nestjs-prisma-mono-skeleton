import { AuditEntity } from "src/commons/shared/entities/audit.entity";
import { ApplicationEntity } from "../../entites/application.entity";
import { InstanceConfigEntity } from "./instance-config.entity";
import { InstanceAuthMethodEntity } from "./instance-auth-method.entity";

export class InstanceEntity extends AuditEntity {
    id: string;
    application_id: string;
    application?: ApplicationEntity;
    name: string;
    reference: string;
    api_key: string;
    secret_key: string;
    access_token_key: string;
    refresh_token_key: string;
    is_active: boolean;
    instance_configs: InstanceConfigEntity[];
    instance_auth_methods: InstanceAuthMethodEntity[];
}