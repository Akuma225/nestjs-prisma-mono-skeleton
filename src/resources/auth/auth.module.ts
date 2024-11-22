import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RandomService } from 'src/commons/services/random.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, RandomService],
  exports: [AuthService, RandomService],
})
export class AuthModule { }
