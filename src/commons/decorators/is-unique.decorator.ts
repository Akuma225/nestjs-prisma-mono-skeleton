import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { IsUniqueMode } from '../enums/is_unique_mode.enum';

export class IsUniqueConstraint extends DatabaseConstraint {
  checkRecord(record: any): boolean {
    return !record;
  }

  defaultMessage(args: ValidationArguments): string {
    return `La valeur de la propriété ${args.property} existe déjà dans la base de données.`;
  }
}

export function IsUnique(
  entity: ModelMappingTable,
  property: string,
  options?: any, // Ajout des options
  validationOptions?: ValidationOptions,
  mode: IsUniqueMode = IsUniqueMode.INSENSITIVE,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property, mode, options],
      validator: IsUniqueConstraint,
    });
  };
}
