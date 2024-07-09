import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegistrationDTO } from './dtos/registration.dto';
import { ActivateAccountDTO } from './dtos/activate-account.dto';
import { ResetActivationOtpDTO } from './dtos/resend-activation-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() data: LoginDTO) {
    return await this.authService.validateUser(data.email, data.password);
  }

  @Post('register')
  async register(@Body() data: RegistrationDTO) {
    return await this.authService.registerUser(data);
  }

  @Post('activate-account')
  async activateAccount(@Body() data: ActivateAccountDTO) {
    return await this.authService.activateAccount(data);
  }

  @Post('resend-activation-otp')
  async resendActivationOtp(@Body() data: ResetActivationOtpDTO) {
    return await this.authService.resendActivationOtp(data);
  }
}
