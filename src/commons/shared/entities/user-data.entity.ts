import { Profile } from 'src/commons/enums/profile.enum';

export class UserData {

  id: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: Profile;
  contact: string;
  is_active: boolean;
  auto_login_token: string;
  is_first_login: boolean;
  mail_verified_at: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;

  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.profile = Profile[data.profile];
    this.contact = data.contact;
    this.is_active = data.is_active;
    this.auto_login_token = data.auto_login_token;
    this.is_first_login = data.is_first_login;
    this.mail_verified_at = data.mail_verified_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }
}
