import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PrismaServiceProvider {
  private static service: PrismaService;

  static setPrismaService(service: PrismaService) {
    PrismaServiceProvider.service = service;
  }

  static getPrismaService(): PrismaService {
    return PrismaServiceProvider.service;
  }
}
