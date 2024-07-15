import { Body, Controller, Get, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { UserVm } from 'src/commons/shared/viewmodels/user.vm';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { AccessTokenData } from 'src/commons/shared/entities/access-token-data.entity';

@ApiTags('User Profile')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(AuthenticationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  @Patch('profile')
  async update(
    @Body() updateAdminDto: UpdateUserDto,
    @Req() req: CustomRequest,
    @Query('mode') mode: 'compact' | 'full' = 'compact'
  ) {
    const user = await this.userService.updateProfile(req.user?.id, updateAdminDto, req.user?.id);

    if (mode === 'full') {
      return new AccessTokenData(user).sub;
    }

    return UserVm.create(user);
  }

  @UseGuards(AuthenticationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  @Get('profile')
  async find(
    @Req() req: CustomRequest,
    @Query('mode') mode: 'compact' | 'full' = 'compact'
  ) {
    const user = await this.userService.getProfile(req.user?.id);

    if (mode === 'full') {
      return new AccessTokenData(user).sub;
    }

    return UserVm.create(user);
  }
}
