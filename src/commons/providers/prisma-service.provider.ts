import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class PrismaServiceProvider {
  private static service: PrismaService;

  static setService(service: PrismaService) {
    PrismaServiceProvider.service = service;
  }

  static getService(): PrismaService {
    return PrismaServiceProvider.service;
  }
}
