import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Version } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminVm } from 'src/commons/shared/viewmodels/admin.vm';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ParamEntity } from 'src/commons/decorators/param-entity.decorator';
import { AdminEntity } from './entities/admin.entity';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { FilterAdminDto } from './dto/filter-admin.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { TokenPair } from 'src/commons/shared/entities/token_pair.model';
import { IsAdminAuthenticated } from 'src/commons/decorators/is-admin-authenticated.decorator';
import { AdminProfile } from 'src/commons/enums/admin-profile.enum';

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  @Version('1')
  @ApiResponse({ status: 201, type: TokenPair })
  @ApiOperation({ summary: 'Login an admin' })
  async login(
    @Body() data: AdminLoginDto,
  ) {
    return this.adminService.login(data);
  }

  @Post()
  @Version('1')
  @ApiResponse({ status: 201, type: AdminVm })
  @ApiOperation({ summary: 'Create a new admin' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async create(
    @Body() data: CreateAdminDto,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.create(await this.adminService.create(data, req.user?.id));
  }

  @Patch(':id')
  @Version('1')
  @ApiResponse({ status: 200, type: AdminVm })
  @ApiOperation({ summary: 'Update an admin' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async update(
    @ParamId({
      model: ModelMappingTable.ADMIN,
      errorMessage: "L'admin n'existe pas",
    }) id: string,
    @Body() data: UpdateAdminDto,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.create(await this.adminService.update(id, data, req.user?.id));
  }

  @Get(':id')
  @Version('1')
  @ApiResponse({ status: 200, type: AdminVm })
  @ApiOperation({ summary: 'Find one admin' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async find(
    @ParamEntity({
      model: ModelMappingTable.ADMIN,
      errorMessage: "L'admin n'existe pas",
    }) admin: AdminEntity,
  ) {
    return AdminVm.create(admin);
  }

  @Get()
  @Pagination()
  @Version('1')
  @ApiResponse({ status: 200, type: AdminVm })
  @ApiOperation({ summary: 'Get all admins' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async getAll(
    @Query() filter: FilterAdminDto,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.createPaginated(await this.adminService.findAll(req.pagination, filter));
  }

  @Delete(':id/soft')
  @Version('1')
  @ApiResponse({ status: 200, type: AdminVm })
  @ApiOperation({ summary: 'Soft delete an admin' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async softDelete(
    @ParamId({
      model: ModelMappingTable.ADMIN,
      errorMessage: "L'admin n'existe pas",
    }) id: string,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.create(await this.adminService.softDelete(id, req.user?.id));
  }

  @Patch(':id/restore')
  @Version('1')
  @ApiResponse({ status: 200, type: AdminVm })
  @ApiOperation({ summary: 'Restore an admin' })
  @IsAdminAuthenticated([AdminProfile.SUPER_ADMIN])
  async restore(
    @ParamId({
      model: ModelMappingTable.ADMIN,
      errorMessage: "L'admin n'existe pas",
    }) id: string,
    @Req() req: CustomRequest,
  ) {
    return AdminVm.create(await this.adminService.restore(id, req.user?.id));
  }
}
