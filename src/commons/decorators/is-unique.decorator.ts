import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint } from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint'
import { IsUniqueMode } from '../enums/is_unique_mode.enum';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { Injectable, Scope } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';

/**
 * Custom validator constraint that checks if a property value is unique in the database.
 */
@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.DEFAULT })
export class IsUniqueConstraint extends DatabaseConstraint {
    constructor(requestContextService: RequestContextService) {
        super(requestContextService);
    }

    /**
     * Checks if the given record is unique.
     * @param record - The record to be checked.
     * @returns Returns true if the record is unique, false otherwise.
     */
    checkRecord(record: any): boolean {
        return !record;
    }

    /**
     * Generates the default error message for the constraint.
     * @param args - The validation arguments.
     * @returns Returns the default error message.
     */
    defaultMessage(args: ValidationArguments): string {
        return `La valeur de la propriété ${args.property} existe déjà dans la base de données.`;
    }
}

export function IsUnique(entity: ModelMappingTable, property: string, validationOptions?: ValidationOptions, mode: IsUniqueMode = IsUniqueMode.INSENSITIVE) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, property, mode],
            validator: IsUniqueConstraint,
        });
    };
}
