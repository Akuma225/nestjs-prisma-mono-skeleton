export class CreateAdminMapper {
    firstname: string;
    lastname: string;
    email: string;
    contact: string;
    password: string;
    profile: string;
    is_active: boolean;
    is_first_login: boolean;
    mail_verified_at: Date;

    constructor(data: any) {
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.contact = data.contact;
        this.password = data.password;
        this.profile = data.profile;
        this.is_active = data.is_active;
        this.is_first_login = data.is_first_login;
        this.mail_verified_at = data.mail_verified_at;
    }
}