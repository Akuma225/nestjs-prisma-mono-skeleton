import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SetProfile } from 'src/commons/decorators/set-profile.decorator';
import { Profile } from 'src/commons/enums/profile.enum';
import { AuthenticationGuard } from 'src/commons/guards/authentication.guard';
import { AuthorizationGuard } from 'src/commons/guards/authorization.guard';
import { UserVm } from 'src/commons/shared/viewmodels/user.vm';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { Cacheable } from 'src/commons/decorators/cacheable.decorator';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admins')
export class AdminController {

  constructor(private readonly adminService: AdminService) { }

  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 201, type: UserVm })
  @Post()
  async create(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: CustomRequest
  ) {
    return UserVm.create(await this.adminService.create(createAdminDto, req.user?.id));
  }

  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 201, type: PaginationVm })
  @Pagination()
  @Cacheable()
  @Get()
  async findAll(
    @Req() req: CustomRequest
  ) {
    return UserVm.createPaginated(await this.adminService.findAll(req.pagination));
  }

  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  @Cacheable()
  @Get(':id')
  async findOne(
    @ParamId({ model: ModelMappingTable.USER, errorMessage: "L'admin n'existe pas !" }) id: string,
  ) {
    return UserVm.create(await this.adminService.findOne(id));
  }

  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  @Patch(':id')
  async update(
    @ParamId({ model: ModelMappingTable.USER, errorMessage: "L'admin n'existe pas !" }) id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @Req() req: CustomRequest
  ) {
    return UserVm.create(await this.adminService.update(id, updateAdminDto, req.user?.id));
  }

  @Delete(':id')
  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 204, description: "L'admin a été définitivement supprimée !" })
  async remove(
    @ParamId({ model: ModelMappingTable.USER, errorMessage: "L'admin n'existe pas !" }) id: string
  ) {
    await this.adminService.delete(id);

    // Return success message with status code 204
    throw new HttpException("La catégorie a été définitivement supprimée !", HttpStatus.NO_CONTENT);
  }

  @Delete(':id/soft')
  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  async softDelete(
    @ParamId({ model: ModelMappingTable.USER, errorMessage: "L'admin n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return UserVm.create(await this.adminService.softDelete(id, req.user?.id));
  }

  @Patch(':id/restore')
  @SetProfile(Profile.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @ApiResponse({ status: 200, type: UserVm })
  async restore(
    @ParamId({ model: ModelMappingTable.USER, errorMessage: "L'admin n'existe pas !" }) id: string,
    @Req() req: CustomRequest
  ) {
    return UserVm.create(await this.adminService.restore(id, req.user?.id));
  }
}
