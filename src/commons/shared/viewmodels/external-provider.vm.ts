import { BaseVm } from "./base.vm";
import { ApiResponseProperty } from "@nestjs/swagger";

export class ExternalProviderVm extends BaseVm {
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    label: string;

    @ApiResponseProperty()
    is_active: boolean;

    constructor(data) {
        super(data);
        this.id = data.id;
        this.label = data.label;
        this.is_active = data.is_active;
    }
}