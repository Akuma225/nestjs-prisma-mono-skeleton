import { Module } from '@nestjs/common';
import { UserLogService } from './user-log.service';
import { UserLogController } from './user-log.controller';

@Module({
  controllers: [UserLogController],
  providers: [UserLogService],
})
export class UserLogModule {}
