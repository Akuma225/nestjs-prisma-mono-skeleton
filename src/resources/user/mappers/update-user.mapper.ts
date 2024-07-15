export class UpdateUserMapper {
    firstname?: string;
    lastname?: string;
    email?: string;
    contact?: string;
    password?: string;

    constructor(data: any) {
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.contact = data.contact;
        this.password = data.password;
    }
}