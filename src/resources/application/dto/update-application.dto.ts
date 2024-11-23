import { CreateApplicationDto } from "./create-application.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {}
