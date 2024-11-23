import { Controller } from '@nestjs/common';
import { UserLogService } from './user-log.service';

@Controller('user-log')
export class UserLogController {
  constructor(private readonly userLogService: UserLogService) {}
}
