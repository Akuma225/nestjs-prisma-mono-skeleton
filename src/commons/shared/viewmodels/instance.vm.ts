import { ApiResponseProperty } from "@nestjs/swagger";
import { ApplicationConfigVm } from "./application-config.vm";
import { ApplicationVm } from "./application.vm";
import { BaseVm } from "./base.vm";

export class InstanceVm extends BaseVm {
    
    @ApiResponseProperty()
    id: string;

    @ApiResponseProperty()
    application?: ApplicationVm;

    @ApiResponseProperty()
    name: string;

    @ApiResponseProperty()
    reference: string;

    @ApiResponseProperty()
    api_key?: string;

    @ApiResponseProperty()
    secret_key?: string;

    @ApiResponseProperty()
    access_token_key?: string;
    
    @ApiResponseProperty()
    refresh_token_key?: string;
    
    @ApiResponseProperty()
    is_active: boolean;
    
    @ApiResponseProperty()
    configs?: ApplicationConfigVm[];

    constructor(data) {
        super(data);
        this.id = data.id;
        this.name = data.name;
        this.reference = data.reference;
        this.api_key = data.api_key;
        this.secret_key = data.secret_key;
        this.access_token_key = data.access_token_key;
        this.refresh_token_key = data.refresh_token_key;
        this.is_active = data.is_active;
        this.configs = data.instance_configs ? data.instance_configs.map(config => new ApplicationConfigVm(config)) : [];
        this.application = data.application ? new ApplicationVm(data.application) : null;
    }
}