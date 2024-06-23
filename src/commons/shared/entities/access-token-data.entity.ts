import { IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';
import { Profile } from 'src/commons/enums/profile.enum';

export class AccessTokenData {
  @IsString()
  sub: string;

  @IsString()
  id: string;

  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsString()
  email: string;

  @IsEnum(Profile)
  profile: Profile;

  @IsString()
  contact: string;

  @IsBoolean()
  is_active: boolean;

  @IsString()
  auto_login_token: string;

  @IsBoolean()
  is_first_login: boolean;

  @IsDate()
  mail_verified_at: Date;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsDate()
  deleted_at: Date;

  constructor(data) {
    this.sub = data.id;
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
