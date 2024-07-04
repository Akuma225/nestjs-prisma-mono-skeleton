import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaClient } from '@prisma/client';

const prisma: any = new PrismaClient();

@ValidatorConstraint({ async: true })
export class IsForeignKeyExistsConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments) {
        const [entity, property] = args.constraints;
        const record = await prisma[entity].findUnique({
            where: {
                [property]: value,
            },
        });
        return !!record;
    }

    defaultMessage(args: ValidationArguments) {
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
