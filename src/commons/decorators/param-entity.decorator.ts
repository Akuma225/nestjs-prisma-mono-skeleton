import {
    createParamDecorator,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../services/prisma.service';
  import { ModelMappingTable } from '../enums/model-mapping.enum';
  import { MatchEntityOptions } from '../interfaces/match-entity-options';
  
  @Injectable()
  export class ParamEntityService {
    constructor(private prisma: PrismaService) {}
  
    async findEntity(
      model: ModelMappingTable,
      value: any,
      property: string,
      options?: MatchEntityOptions,
    ): Promise<any> {
      const entityModel: any = this.prisma[model];
      if (!entityModel) {
        throw new Error(`Model ${model} not found in Prisma schema.`);
      }
  
      const record = await entityModel.findUnique({
        where: { [property]: value },
        select: options?.select,
        include: options?.include,
      });
  
      if (!record) {
        throw new HttpException(
          `${model} with ${property} ${value} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
  
      return record;
    }
  }
  
  export const ParamEntity = createParamDecorator(
    async (
      data: {
        key?: string;
        model: ModelMappingTable;
        property?: string;
        options?: MatchEntityOptions;
        errorMessage?: string;
      },
      ctx: ExecutionContext,
    ) => {
      const request = ctx.switchToHttp().getRequest();
      const value = request.params[data.key || 'id'];
  
      const paramEntityService = new ParamEntityService(new PrismaService());
  
      const property = data.property || 'id';
      const record = await paramEntityService.findEntity(
        data.model,
        value,
        property,
        data.options,
      );
  
      request.params[data.key || 'id'] = record; // Remplacer la valeur par l'objet trouvé
      return record;
    },
  );
  