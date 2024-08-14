import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
  } from 'class-validator';
  import { PrismaClient } from '@prisma/client';
  import { RequestContextService } from '../services/request-context.service';
  import { Injectable, Logger, Scope } from '@nestjs/common';
import { CustomRequest } from '../interfaces/custom_request';
  
  const prisma: any = new PrismaClient();
  
  @ValidatorConstraint({ async: true })
  @Injectable({ scope: Scope.DEFAULT })
  export abstract class DatabaseConstraint
    implements ValidatorConstraintInterface
  {
    protected foundEntity: any;
  
    constructor(protected requestContextService: RequestContextService) {}
  
    async validate(value: any, args: ValidationArguments): Promise<boolean> {
      const [entity, property, mode, options] = args.constraints;
      const request: CustomRequest = this.requestContextService.getContext();
  
      Logger.log(mode, options)
      
      let where: any = {
        [property]: {
          equals: value,
          mode,
        },
      };
  
      const updateMethods = ['PATCH', 'PUT'];
      const userId = request.params.id || request.user?.id;
  
      if (property !== 'id' && updateMethods.includes(request.method) && userId) {
        where = {
          ...where,
          id: {
            not: userId,
          },
        };
      }
  
      Logger.log(where, 'DatabaseConstraint validate where');
  
      const record = await prisma[entity].findFirst({
        where,
        select: options?.select,
        include: options?.include,
      });
  
      if (record) {
        this.foundEntity = record;
        return this.checkRecord(record);
      }
  
      return false;
    }
  
    abstract checkRecord(record: any): boolean;
  
    abstract defaultMessage(args: ValidationArguments): string;
  
    getEntity() {
      return this.foundEntity;
    }
  }
  