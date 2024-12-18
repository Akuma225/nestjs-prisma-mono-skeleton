import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { IsUniqueMode } from '../enums/is_unique_mode.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ async: true })
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
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsUniqueConstraint,
    });
  };
}
