import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class AdminEntity extends AuditEntity {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    profile: string;
    password: string;
    email_verified_at?: Date;
    is_active: boolean;
    last_login_at?: Date;
    auto_login_token?: string;
}