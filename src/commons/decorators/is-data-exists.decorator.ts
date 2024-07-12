import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint } from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint'
import { ModelMappingTable } from '../enums/model-mapping.enum';

@ValidatorConstraint({ async: true })
export class IsDataExistsConstraint extends DatabaseConstraint {
    checkRecord(record: any): boolean {
        return !!record;
    }

    defaultMessage(args: ValidationArguments): string {
        return `La valeur de la propriété ${args.property} n'existe pas dans la base de données.`;
    }
}

/**
 * Decorator that checks if data exists in a specific entity and property.
 * @param entity - The entity to check for data existence.
 * @param property - The property within the entity to check for data existence.
 * @param validationOptions - Optional validation options.
 * @returns A decorator function.
 */
export function IsDataExists(entity: ModelMappingTable, property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, property],
            validator: IsDataExistsConstraint,
        });
    };
}
