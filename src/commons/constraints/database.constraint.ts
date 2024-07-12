import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { RequestContextService } from '../services/request-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom_request';

const prisma: any = new PrismaClient();

@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.DEFAULT })
export abstract class DatabaseConstraint implements ValidatorConstraintInterface {
    constructor(protected requestContextService: RequestContextService) { }

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const [entity, property, mode] = args.constraints;
        const request: CustomRequest = this.requestContextService.getContext();

        let where: any = {
            [property]: {
                equals: value,
                mode,
            },
        };

        const updateMethods = ["PATCH", "PUT"];

        if (property !== 'id' && updateMethods.includes(request.method) && request.params.id) {
            where = {
                ...where,
                id: {
                    not: request.params.id,
                },
            }
        }

        Logger.log(where, "DatabaseConstraint validate where");

        const record = await prisma[entity].findFirst({
            where
        });
        return this.checkRecord(record);
    }

    abstract checkRecord(record: any): boolean;
    abstract defaultMessage(args: ValidationArguments): string;
}