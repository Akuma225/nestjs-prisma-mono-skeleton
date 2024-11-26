import { AdminProfile } from 'src/commons/enums/admin-profile.enum';

export class AdminData {

  id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: string;
  is_active: boolean;
  auto_login_token: string;
  last_login_at: boolean;
  email_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.profile = AdminProfile[data.profile];
    this.is_active = data.is_active;
    this.auto_login_token = data.auto_login_token;
    this.last_login_at = data.last_login_at;
    this.email_verified_at = data.email_verified_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }
}
