import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
} from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { Injectable, Logger } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';

@Injectable()
@ValidatorConstraint({ async: true })
export class IsDataExistsConstraint extends DatabaseConstraint {
  constructor(protected requestContextService: RequestContextService) {
    super(requestContextService);
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    return await super.validate(value, args);
  }

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
  validationOptions?: ValidationOptions,
) {
  Logger.log('Init IsDataExists')
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
