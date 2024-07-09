import { createParamDecorator, ExecutionContext, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { ModelMappingTable } from '../enums/model-mapping.enum';
import { PrismaService } from '../services/prisma.service';

export const ParamId = createParamDecorator(
    async (
        data: { key?: string, model: ModelMappingTable, property?: string, errorMessage?: string },
        ctx: ExecutionContext,
    ) => {
        const request = ctx.switchToHttp().getRequest();
        const value = request.params[data.key || 'id'];

        const prisma = new PrismaService();

        const model: any = prisma[data.model];
        if (!model) {
            throw new Error(`Model ${data.model} not found in Prisma schema.`);
        }

        const property = data.property || 'id';
        const record = await model.findUnique({
            where: {
                [property]: value,
            },
        });

        if (!record) {
            throw new HttpException(data.errorMessage || `${data.model} with ${property} ${value} not found.`, HttpStatus.NOT_FOUND);
        }

        return value;
    },
);