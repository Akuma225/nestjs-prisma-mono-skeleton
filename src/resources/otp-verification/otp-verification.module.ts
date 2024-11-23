import { Module } from '@nestjs/common';
import { OtpVerificationService } from './otp-verification.service';
import { OtpVerificationController } from './otp-verification.controller';

@Module({
  controllers: [OtpVerificationController],
  providers: [OtpVerificationService],
})
export class OtpVerificationModule {}
