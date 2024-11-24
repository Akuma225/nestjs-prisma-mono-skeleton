import { ApiResponseProperty } from "@nestjs/swagger";
import { BaseVm } from "./base.vm";

export class ApplicationConfigVm extends BaseVm {
    
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    key: string;

    @ApiResponseProperty()
    value: any;

    constructor(data) {
        super(data);
        this.id = data.id;
        this.key = data.key;
        this.value = data.value;
    }
}