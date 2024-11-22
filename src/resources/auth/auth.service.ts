import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/commons/services/prisma.service';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prismaService: PrismaService,
    ) { }

}
