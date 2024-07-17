import { Profile } from "src/commons/enums/profile.enum";
import { AuditEntity } from "src/commons/shared/entities/audit.entity";

export class UserEntity extends AuditEntity {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    contact: string;
    is_active: boolean;
    is_first_login: boolean;
    mail_verified_at: Date;
    profile: Profile;
    password: string;
}