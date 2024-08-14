import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { DatabaseConstraint } from '../constraints/database.constraint';
import { Injectable } from '@nestjs/common';
import { RequestContextService } from '../services/request-context.service';
import { IsUniqueMode } from '../enums/is_unique_mode.enum';
import { MatchEntityOptions } from '../interfaces/match-entity-options';

@Injectable()
@ValidatorConstraint({ async: true })
export class AppEntityConstraint extends DatabaseConstraint {
  constructor(protected requestContextService: RequestContextService) {
    super(requestContextService);
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [entity, property, options] = args.constraints;

    const isValid = await super.validate(value, args);
    if (isValid) {
      const foundEntity = this.getEntity();
      const object = args.object as Record<string, any>;
      object[args.property] = foundEntity;
    }

    return isValid;
  }

  checkRecord(record: any): boolean {
    return !!record;
  }

  defaultMessage(args: ValidationArguments): string {
    return `La valeur de la propriété ${args.property} n'existe pas dans la base de données.`;
  }
}

export function MatchEntity(
  entity: ModelMappingTable,
  property: string,
  options?: MatchEntityOptions,
  validationOptions?: ValidationOptions,
  mode: IsUniqueMode = IsUniqueMode.INSENSITIVE,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity, property, mode, options],
      validator: AppEntityConstraint,
    });
  };
}
