import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaClient } from '@prisma/client';
import { RequestContextService } from '../services/request-context.service';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom_request';

const prisma: any = new PrismaClient();

/**
 * Abstract class representing a database constraint.
 * This class provides a base implementation for validating values against a database.
 */
@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.DEFAULT })
export abstract class DatabaseConstraint implements ValidatorConstraintInterface {
    /**
     * Creates an instance of DatabaseConstraint.
     * @param requestContextService - The request context service.
     */
    constructor(protected requestContextService: RequestContextService) { }

    /**
     * Validates the given value against the database.
     * @param value - The value to be validated.
     * @param args - The validation arguments.
     * @returns A promise that resolves to a boolean indicating whether the value is valid.
     */
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

        const userId = request.params.id || request.user?.id;

        if (property !== 'id' && updateMethods.includes(request.method) && userId) {
            where = {
                ...where,
                id: {
                    not: userId,
                },
            }
        }

        Logger.log(where, "DatabaseConstraint validate where");

        const record = await prisma[entity].findFirst({
            where
        });
        return this.checkRecord(record);
    }

    /**
     * Checks if the given record is valid.
     * This method should be implemented by subclasses.
     * @param record - The record to be checked.
     * @returns A boolean indicating whether the record is valid.
     */
    abstract checkRecord(record: any): boolean;

    /**
     * Gets the default error message for the constraint.
     * This method should be implemented by subclasses.
     * @param args - The validation arguments.
     * @returns The default error message.
     */
    abstract defaultMessage(args: ValidationArguments): string;
}