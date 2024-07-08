import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { PrismaClient } from '@prisma/client';

const prisma: any = new PrismaClient();

@ValidatorConstraint({ async: true })
export abstract class DatabaseConstraint implements ValidatorConstraintInterface {
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const [entity, property, mode] = args.constraints;
        const record = await prisma[entity].findUnique({
            where: {
                //[property]: property === 'id' ? value : { equals: value, mode },
                [property]: value,
            },
        });
        return this.checkRecord(record);
    }

    abstract checkRecord(record: any): boolean;

    abstract defaultMessage(args: ValidationArguments): string;
}
