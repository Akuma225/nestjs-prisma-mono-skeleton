import { ApiResponseProperty } from "@nestjs/swagger";
import { BaseVm } from "./base.vm";

export class AdminVm extends BaseVm {
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    firstname: string;

    @ApiResponseProperty()
    lastname: string;

    @ApiResponseProperty()
    email: string;

    @ApiResponseProperty()
    last_login_at: Date;

    @ApiResponseProperty()
    profile: string;

    @ApiResponseProperty()
    is_active: boolean;

    constructor(data: any) {
        super(data);
        this.id = data.id;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.last_login_at = data.last_login_at;
        this.profile = data.profile;
        this.is_active = data.is_active;
    }
}