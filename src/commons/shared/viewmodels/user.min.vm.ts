import { ApiResponseProperty } from "@nestjs/swagger";

export class UserMinVm {
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    email: string;

    @ApiResponseProperty()
    firstname: string;

    @ApiResponseProperty()
    lastname: string;

    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
    }
}