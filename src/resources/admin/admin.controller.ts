import { Body, Controller, Post, Req, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminVm } from 'src/commons/shared/viewmodels/admin.vm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CustomRequest } from 'src/commons/interfaces/custom_request';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Version('1')
  @ApiResponse({ status: 201, type: AdminVm })
  @ApiOperation({ summary: 'Create a new admin' })
  async create(
    @Body() data: CreateAdminDto,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.create(await this.adminService.create(data, req.user?.id));
  }
}
