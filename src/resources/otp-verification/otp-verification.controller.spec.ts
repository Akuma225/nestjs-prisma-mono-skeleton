import { Test, TestingModule } from '@nestjs/testing';
import { OtpVerificationController } from './otp-verification.controller';
import { OtpVerificationService } from './otp-verification.service';

describe('OtpVerificationController', () => {
  let controller: OtpVerificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtpVerificationController],
      providers: [OtpVerificationService],
    }).compile();

    controller = module.get<OtpVerificationController>(OtpVerificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
