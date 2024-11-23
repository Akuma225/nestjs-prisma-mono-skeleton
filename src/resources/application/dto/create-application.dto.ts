import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateApplicationDto {
    @IsString()
    @ApiProperty({
        example: "My Application"
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: "lorem ipsum"
    })
    description?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
        required: false
    })
    is_active?: boolean;
}