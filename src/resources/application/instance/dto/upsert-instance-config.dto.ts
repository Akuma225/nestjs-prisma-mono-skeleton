import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpsertInstanceConfigDto {
    @IsUUID()
    @IsOptional()
    instance_id?: string;

    @IsString()
    key: string;

    value: any;
}