import { Controller } from '@nestjs/common';
import { OtpVerificationService } from './otp-verification.service';

@Controller('otp-verification')
export class OtpVerificationController {
  constructor(private readonly otpVerificationService: OtpVerificationService) {}
}
