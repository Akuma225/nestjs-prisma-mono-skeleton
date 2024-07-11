import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  private transactionLog: Array<{ model: string, action: string, data: any }> = [];

  startTransaction() {
    this.transactionLog = [];
  }

  async commitTransaction() {
    this.transactionLog = [];
  }

  async rollbackTransaction() {
    console.log(this.transactionLog)
    Logger.log('Rolling back transaction');
    for (const log of this.transactionLog.reverse()) {
      if (log.action === 'create') {
        await this[log.model].delete({ where: log.data.where });
      } else if (log.action === 'update') {
        await this[log.model].update({ where: log.data.where, data: log.data.previousData });
      }
    }
    this.transactionLog = [];
  }

  async create(model: string, data: any, include?: any) {
    const createdData = await this[model].create({ data, include });
    this.transactionLog.push({ model, action: 'create', data: { where: { id: createdData.id } } });
    Logger.log(this.transactionLog);
    return createdData;
  }

  async update(model: string, where: any, data: any, include?: any) {
    const previousData = await this[model].findFirst({ where });
    const updatedData = await this[model].update({ where, data, include });
    this.transactionLog.push({ model, action: 'update', data: { where, previousData } });
    return updatedData;
  }
}
