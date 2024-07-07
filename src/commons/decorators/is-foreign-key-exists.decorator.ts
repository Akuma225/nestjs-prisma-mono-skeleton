import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint } from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint'

@ValidatorConstraint({ async: true })
export class IsForeignKeyExistsConstraint extends DatabaseConstraint {
    checkRecord(record: any): boolean {
        return !!record;
    }

    defaultMessage(args: ValidationArguments): string {
        return `La valeur de la propriété ${args.property} n'existe pas dans la base de données.`;
    }
}

export function IsForeignKeyExists(entity: string, property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, property],
            validator: IsForeignKeyExistsConstraint,
        });
    };
}
