import { Test, TestingModule } from '@nestjs/testing';
import { UserLogService } from './user-log.service';

describe('UserLogService', () => {
  let service: UserLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserLogService],
    }).compile();

    service = module.get<UserLogService>(UserLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
