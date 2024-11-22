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
    
  }

}
