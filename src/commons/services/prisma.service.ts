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

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private transactionClient: PrismaClient | null = null;
  protected static requestContextService: RequestContextService;

  constructor() {
    super();

    // Créer un proxy pour intercepter les appels de méthodes
    return new Proxy(this, {
      get: (target, prop) => {
        // Si la propriété demandée est une méthode de PrismaClient, on vérifie si on doit utiliser le client transactionnel ou non
        if (typeof target[prop] === 'function' && prop in target) {
          const client = target.getClient();
          return client[prop].bind(client);
        }

        // Sinon, on retourne la propriété normalement
        return target[prop];
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  getClient() {
    const requestContext = PrismaService.getRequestContextService();
    const request: CustomRequest = requestContext.getContext();

    if (request.transaction && request.prismaTransaction) {
      Logger.log('Using transaction client');
      return request.prismaTransaction;
    }

    return this.transactionClient || this;
  }

  private static getRequestContextService(): RequestContextService {
    if (!PrismaService.requestContextService) {
      PrismaService.requestContextService =
        RequestContextServiceProvider.getService();
    }
    return PrismaService.requestContextService;
  }

  async create(model: string, data: any, include?: any, select?: any) {
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

  async update(
    model: string,
    where: any,
    data: any,
    include?: any,
    select?: any,
  ) {
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

  async delete(model: string, where: any) {
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
