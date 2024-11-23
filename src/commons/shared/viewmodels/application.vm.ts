import { ApiResponseProperty } from "@nestjs/swagger";
import { BaseVm } from "./base.vm";

export class ApplicationVm extends BaseVm {
    
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    name: string;

    @ApiResponseProperty()
    reference: string;

    @ApiResponseProperty()
    description?: string;

    @ApiResponseProperty()
    is_active: boolean;

    constructor(data) {
        super(data);
        this.id = data.id;
        this.name = data.name;
        this.reference = data.reference;
        this.description = data.description;
        this.is_active = data.is_active;
    }
}