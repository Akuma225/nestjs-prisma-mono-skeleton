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
    await this.createAdmin();

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

  async createAdmin() {
    Logger.log('Admin bootstrapping...');

    const existingCount = await this.prismaService.admins.count();

    if (existingCount > 0) {
      Logger.log('Admin already exists. Skipping...');
      return;
    }

    const password = await bcrypt.hash('admin1234', 10);

    await this.prismaService.admins.create({
      data: {
        firstname: 'John',
        lastname: 'Doe',
        email: 'johndoe@test.com',
        password,
        profile: Profile.SUPER_ADMIN,
        is_active: true,
        email_verified_at: new Date()
      }
    });

    Logger.log('Admin created.');
  }
}
