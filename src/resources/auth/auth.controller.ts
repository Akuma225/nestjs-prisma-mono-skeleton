import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login.dto';
import { BasicVm } from 'src/commons/shared/viewmodels/basic.vm';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDTO) {
    await this.authService.validateUser(data.email, data.password);

    return BasicVm.create({
      id: "1",
      name: "John Doe",
      reference: "JD"
    })
  }
}
