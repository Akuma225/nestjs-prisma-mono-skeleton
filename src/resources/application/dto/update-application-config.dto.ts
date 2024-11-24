import { ApiProperty } from "@nestjs/swagger";
import { UpsertApplicationConfigDto } from "../application-config/dto/upsert-application-config.dto";
import { IsBoolean, IsOptional, ValidateNested } from "class-validator";

export class UpdateApplicationConfigDto {

    @ValidateNested({ each: true })
    @ApiProperty({
        type: [UpsertApplicationConfigDto],
        description: 'List of application configs to update'
    })
    configs: UpsertApplicationConfigDto[];

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        type: Boolean,
        description: 'Apply the configuration on the instances'
    })
    apply_on_instance?: boolean;
}
