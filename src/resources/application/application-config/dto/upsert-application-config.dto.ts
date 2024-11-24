import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpsertApplicationConfigDto {
    @IsUUID()
    @IsOptional()
    application_id?: string;

    @IsString()
    key: string;

    value: any;
}