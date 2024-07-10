import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { RegistrationDTO } from './dtos/registration.dto';
import { ActivateAccountDTO } from './dtos/activate-account.dto';
import { ResetActivationOtpDTO } from './dtos/resend-activation-otp.dto';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { RequestResetPasswordDTO } from './dtos/request-reset-password.dto';
import { ConfirmResetPasswordDTO } from './dtos/confirm-reset-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { ResendResetPasswordOtpDTO } from './dtos/resend-reset-password-otp.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
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

  @Get('refresh-token')
  async refreshToken(
    @Query('refresh_token') refreshToken: string,
  ) {
    return await this.authService.refreshTokens(refreshToken);
  }

  @Get('logout')
  @UseGuards(AuthenticationGuard)
  async logout(@Req() req: CustomRequest) {
    await this.authService.revokeToken(req.user.id);
    throw new HttpException("Utilisateur déconnecté avec succès !", HttpStatus.NO_CONTENT);
  }

  @Post('password-reset')
  async requestResetPassword(@Body() data: RequestResetPasswordDTO) {
    return await this.authService.requestResetPassword(data);
  }

  @Post('password-reset/resend')
  async resendResetPasswordOtp(@Body() data: ResendResetPasswordOtpDTO) {
    return await this.authService.resendResetPasswordOtp(data);
  }

  @Post('password-reset/confirm')
  async confirmResetPassword(@Body() data: ConfirmResetPasswordDTO) {
    return await this.authService.confirmResetPassword(data);
  }

  @Post('password-reset/reset')
  async resetPassword(@Body() data: ResetPasswordDTO) {
    await this.authService.resetPassword(data);

    return {
      message: 'Mot de passe réinitialisé avec succès !'
    }
  }
}
