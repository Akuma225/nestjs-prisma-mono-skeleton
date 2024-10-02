import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RequestContextService } from './request-context.service';
import { RequestContextServiceProvider } from '../providers/request-context-service.provider';
import { CustomRequest } from '../interfaces/custom_request';
import { CreateOptions } from '../interfaces/services/prisma/create-options';
import { UpdateOptions } from '../interfaces/services/prisma/update-options';
import { DeleteOptions } from '../interfaces/services/prisma/delete-options';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private transactionClient: PrismaClient | null = null;
  protected static requestContextService: RequestContextService;

  constructor() {
    super();
    return new Proxy(this, {
      get: (target, prop: string) => {
        if (typeof target[prop] !== 'undefined') {
          const client = target.getClient();

          return typeof client[prop] === 'function'
            ? client[prop].bind(client)
            : client[prop];
        }
        return undefined;
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private static getRequestContextService(): RequestContextService {
    if (!PrismaService.requestContextService) {
      PrismaService.requestContextService =
        RequestContextServiceProvider.getService();
    }
    return PrismaService.requestContextService;
  }

  getClient(): PrismaClient {
    const requestContextService = PrismaService.getRequestContextService();
  
    if (!requestContextService) {
      Logger.warn('RequestContextService is not initialized.');
      return this.transactionClient || this;
    }
  
    const request: CustomRequest = requestContextService.getContext();
  
    if (!request) {
      Logger.warn('RequestContext is not available.');
      return this.transactionClient || this;
    }
  
    if (request.transaction && request.prismaTransaction && request.prismaTransaction.$connect) {
      Logger.log('Using transaction client');
      return request.prismaTransaction;
    }
  
    return this.transactionClient || this;
  } 

  async create(options: CreateOptions) {
    const { model, data, include, select } = options;

    try {
      const createdData = await this.getClient()[model].create({
        data,
        include,
        select: !include ? select : undefined,
      });
      Logger.log(`Created record in ${model}`, JSON.stringify(createdData));
      return createdData;
    } catch (error) {
      Logger.error(`Error creating record in ${model}`, error.stack);
      throw error;
    }
  }

  async update(options: UpdateOptions) {
    const { model, where, data, include, select } = options;

    try {
      const previousData = await this.getClient()[model].findUnique({ where });
      if (!previousData) {
        throw new Error(`Record not found for update in ${model}`);
      }
      const updatedData = await this.getClient()[model].update({
        where,
        data,
        include,
        select: !include ? select : undefined,
      });
      Logger.log(`Updated record in ${model}`, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      Logger.error(`Error updating record in ${model}`, error.stack);
      throw error;
    }
  }

  async delete(options: DeleteOptions) {
    const { model, where } = options;
    
    try {
      const deletedData = await this.getClient()[model].delete({ where });
      Logger.log(`Deleted record in ${model}`, JSON.stringify(deletedData));
      return deletedData;
    } catch (error) {
      Logger.error(`Error deleting record in ${model}`, error.stack);
      throw error;
    }
  }
}
