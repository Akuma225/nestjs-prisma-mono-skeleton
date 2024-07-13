import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private transactionLog: Array<{ model: string, action: string, data: any }> = [];

  /**
   * Initializes the Prisma Client connection when the module is initialized.
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnects the Prisma Client when the module is destroyed.
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Starts a new transaction by initializing the transaction log.
   */
  startTransaction() {
    this.transactionLog = [];
    Logger.log('Transaction started');
  }

  /**
   * Commits the current transaction by clearing the transaction log.
   */
  async commitTransaction() {
    this.transactionLog = [];
    Logger.log('Transaction committed');
  }

  /**
   * Rolls back the current transaction by reverting all logged operations.
   */
  async rollbackTransaction() {
    Logger.log('Rolling back transaction');
    for (const log of this.transactionLog.reverse()) {
      if (log.action === 'create') {
        await this[log.model].delete({ where: log.data.where });
      } else if (log.action === 'update') {
        await this[log.model].update({ where: log.data.where, data: log.data.previousData });
      } else if (log.action === 'delete') {
        await this[log.model].create({ data: log.data.where });
      }
    }
    this.transactionLog = [];
    Logger.log('Transaction rolled back');
  }

  /**
   * Creates a new record in the specified model.
   * 
   * @param model - The name of the model.
   * @param data - The data to create the record with.
   * @param include - Optional include relations.
   * @returns The created record.
   * @throws {Error} If an error occurs while creating the record.
   */
  async create(model: string, data: any, include?: any, select?: any) {
    try {
      const createdData = await this[model].create({
        data,
        include,
        select: !include ? select : undefined
      });
      this.transactionLog.push({ model, action: 'create', data: { where: { id: createdData.id } } });
      Logger.log(`Created record in ${model}`, JSON.stringify(createdData));
      return createdData;
    } catch (error) {
      Logger.error(`Error creating record in ${model}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates a record in the specified model.
   * 
   * @param model - The name of the model.
   * @param where - The condition to find the record to update.
   * @param data - The new data to update the record with.
   * @param include - Optional include relations.
   * @returns The updated record.
   * @throws {Error} If an error occurs while updating the record.
   */
  async update(model: string, where: any, data: any, include?: any, select?: any) {
    try {
      const previousData = await this[model].findUnique({ where });
      if (!previousData) {
        throw new Error(`Record not found for update in ${model}`);
      }
      const updatedData = await this[model].update({
        where,
        data,
        include,
        select: !include ? select : undefined
      });
      this.transactionLog.push({ model, action: 'update', data: { where, previousData } });
      Logger.log(`Updated record in ${model}`, JSON.stringify(updatedData));
      return updatedData;
    } catch (error) {
      Logger.error(`Error updating record in ${model}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a record in the specified model.
   * 
   * @param model - The name of the model.
   * @param where - The condition to find the record to delete.
   * @returns The deleted record.
   * @throws {Error} If an error occurs while deleting the record.
   */
  async delete(model: string, where: any) {
    try {
      const deletedData = await this[model].delete({ where });
      this.transactionLog.push({ model, action: 'delete', data: { where } });
      Logger.log(`Deleted record in ${model}`, JSON.stringify(deletedData));
      return deletedData;
    } catch (error) {
      Logger.error(`Error deleting record in ${model}`, error.stack);
      throw error;
    }
  }
}
