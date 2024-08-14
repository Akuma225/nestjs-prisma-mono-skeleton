import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint';
import { ModelMappingTable } from '../enums/model-mapping.enum';

export class IsDataExistsConstraint extends DatabaseConstraint {
  checkRecord(record: any): boolean {
    return !!record;
  }

  defaultMessage(args: ValidationArguments): string {
    return `La valeur de la propriété ${args.property} n'existe pas dans la base de données.`;
  }
}

export function IsDataExists(
  entity: ModelMappingTable,
  property: string,
  options?: any, // Ajout des options
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property, options],
      validator: IsDataExistsConstraint,
    });
  };
}
