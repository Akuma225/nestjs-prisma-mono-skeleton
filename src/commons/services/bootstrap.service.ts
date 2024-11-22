import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Profile } from '../enums/profile.enum';
import * as bcrypt from 'bcrypt';
import { INTERNAL_PROVIDER_SEED } from '../constants/internal-provider.seed';
import { EXTERNAL_PROVIDER_SEED } from '../constants/external-provider.seed';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async onApplicationBootstrap() {
    Logger.log('Bootstrapping application...');

    await this.createInternalProviders();
    await this.createExternalProviders();

    Logger.log('Bootstrapping Finished');
  }

  async createInternalProviders() {
    Logger.log('Internal Providers bootstrapping...');

    const existingCount = await this.prismaService.internal_providers.count();

    if (existingCount > 0) {
      Logger.log('Internal Providers already exist. Skipping...');
      return;
    }

    const internalProviders = INTERNAL_PROVIDER_SEED;

    await this.prismaService.internal_providers.createMany({
      data: internalProviders
    });

    Logger.log(`${internalProviders.length} Internal Providers created.`);
    Logger.log('Internal Providers bootstrapping finished.');
  }

  async createExternalProviders() {
    Logger.log('External Providers bootstrapping...');

    const existingCount = await this.prismaService.external_providers.count();

    if (existingCount > 0) {
      Logger.log('External Providers already exist. Skipping...');
      return;
    }

    const externalProviders = EXTERNAL_PROVIDER_SEED;

    await this.prismaService.external_providers.createMany({
      data: externalProviders
    });

    Logger.log(`${externalProviders.length} External Providers created.`);
    Logger.log('External Providers bootstrapping finished.');
  }

}
