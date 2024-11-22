import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Profile } from '../enums/profile.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async onApplicationBootstrap() {
    await this.createSuperAdmin()
  }

  async createSuperAdmin() {
    Logger.log("Creating super admin...")
    const admins = await this.prismaService.users.findMany({
      where: {
        profile: {
          in: [Profile.SUPER_ADMIN, Profile.ADMIN]
        }
      }
    })

    if (admins.length === 0) {
      await this.prismaService.users.create({
        data: {
          firstname: "Jack",
          lastname: "DA",
          email: "jack.da@gmail.com",
          password: await bcrypt.hash("password", 10),
          profile: Profile.SUPER_ADMIN
        }
      })

      Logger.log("Super admin created")
    }
  }
}
