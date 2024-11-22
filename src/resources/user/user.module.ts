import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'MODEL_MAPPING',
      useValue: ModelMappingTable.USER,
    }
  ],
})
export class UserModule { }
