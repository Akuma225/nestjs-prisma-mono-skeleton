import { Controller } from '@nestjs/common';
import { InstanceService } from './instance.service';

@Controller('instance')
export class InstanceController {
  constructor(private readonly instanceService: InstanceService) {}
}
