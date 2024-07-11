import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint } from 'class-validator';
import { DatabaseConstraint } from '../constraints/database.constraint'
import { IsUniqueMode } from '../enums/is_unique_mode.enum';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { Injectable, Scope } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { RequestContextService } from '../services/request-context.service';

@ValidatorConstraint({ async: true })
@Injectable({ scope: Scope.DEFAULT })
export class IsUniqueConstraint extends DatabaseConstraint {
    constructor(requestContextService: RequestContextService) {
        super(requestContextService);
    }

    checkRecord(record: any): boolean {
        return !record;
    }

    defaultMessage(args: ValidationArguments): string {
        return `La valeur de la propriété ${args.property} existe déjà dans la base de données.`;
    }
}

export function IsUnique(entity: ModelMappingTable, property: string, validationOptions?: ValidationOptions, paramKeys?: string[], mode: IsUniqueMode = IsUniqueMode.INSENSITIVE) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [entity, property, mode, paramKeys],
            validator: IsUniqueConstraint,
        });
    };
}
