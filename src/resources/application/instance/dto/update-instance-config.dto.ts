import { ApiProperty } from "@nestjs/swagger";
import { ValidateNested } from "class-validator";
import { UpsertInstanceConfigDto } from "./upsert-instance-config.dto";

export class UpdateInstanceConfigDto {

    @ValidateNested({ each: true })
    @ApiProperty({
        type: [UpsertInstanceConfigDto],
        description: 'List of instance configs to update'
    })
    configs: UpsertInstanceConfigDto[];

}
