import { Test, TestingModule } from '@nestjs/testing';
import { OtpVerificationService } from './otp-verification.service';

describe('OtpVerificationService', () => {
  let service: OtpVerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpVerificationService],
    }).compile();

    service = module.get<OtpVerificationService>(OtpVerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
