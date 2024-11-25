import { ApiResponseProperty } from "@nestjs/swagger";
import { BaseVm } from "./base.vm";
import { ApplicationConfigVm } from "./application-config.vm";
import { InstanceMinVm } from "./instance-min.vm";

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

    @ApiResponseProperty()
    configs: ApplicationConfigVm[];

    @ApiResponseProperty()
    instances?: InstanceMinVm[];

    constructor(data) {
        super(data);
        this.id = data.id;
        this.name = data.name;
        this.reference = data.reference;
        this.description = data.description;
        this.is_active = data.is_active;
        this.configs = data.app_configs ? data.app_configs.map(config => new ApplicationConfigVm(config)) : [];
        this.instances = data.instances ? data.instances.map(instance => new InstanceMinVm(instance)) : [];
    }
}