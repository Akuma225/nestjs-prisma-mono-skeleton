import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsOptional } from "class-validator";

export class FilterApplicationDto {
    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
        required: false
    })
    is_active?: boolean;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        example: "2021-01-01",
        required: false
    })
    from_created_at?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        example: "2021-01-31",
        required: false
    })
    to_created_at?: string;
}