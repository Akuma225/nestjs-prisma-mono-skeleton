import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Version } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateApplicationDto } from './dto/create-application.dto';
import { CustomRequest } from 'src/commons/interfaces/custom_request';
import { ApplicationVm } from 'src/commons/shared/viewmodels/application.vm';
import { Pagination } from 'src/commons/decorators/pagination.decorator';
import { FilterApplicationDto } from './dto/filter-application.dto';
import { ParamEntity } from 'src/commons/decorators/param-entity.decorator';
import { ModelMappingTable } from 'src/commons/enums/model-mapping.enum';
import { ApplicationEntity } from './entites/application.entity';
import { ParamId } from 'src/commons/decorators/param-id.decorator';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Transaction } from 'src/commons/decorators/transaction.decorator';
import { UpdateApplicationConfigDto } from './dto/update-application-config.dto';
import { InstanceVm } from 'src/commons/shared/viewmodels/instance.vm';
import { InstanceService } from './instance/instance.service';
import { UpdateInstanceConfigDto } from './instance/dto/update-instance-config.dto';
import { InstanceEntity } from './instance/entities/instance.entity';
import { ResetInstanceConfigDto } from './instance/dto/reset-instance-config.dto';
import { CreateInstanceDto } from './instance/dto/create-instance.dto';
import { application } from 'express';
import { UpdateInstanceDto } from './instance/dto/update-instance.dto';
import { PaginationVm } from 'src/commons/shared/viewmodels/pagination.vm';

@ApiTags('Applications')
@Controller('apps')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly instanceService: InstanceService
  ) {}

  @Post()
  @Transaction()
  @ApiResponse({ status: 201, type: ApplicationVm })
  @ApiOperation({ summary: 'Create a new application' })
  @Version('1')
  async create(
    @Body() data: CreateApplicationDto,
    @Req() req: CustomRequest
  ) {
    return ApplicationVm.create(await this.applicationService.create(data, req.user?.id));
  }

  @Post('/:id/instances')
  @Transaction()
  @ApiResponse({ status: 201, type: InstanceVm })
  @ApiOperation({ summary: 'Create a new application instance' })
  @Version('1')
  async createInstance(
    @ParamEntity({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas"
    }) application: ApplicationEntity,
    @Body() data: CreateInstanceDto,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(await this.instanceService.create(
      {
        ...data,
        application_id: application.id
      }, 
      req.user?.id
    ));
  }

  @Delete('/instances/:id/soft')
  @ApiResponse({ status: 201, type: InstanceVm })
  @ApiOperation({ summary: 'Soft delete an instance' })
  @Version('1')
  async softDeleteInstance(
    @ParamId({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas"
    }) instanceId: string,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(await this.instanceService.softDelete(
      instanceId, 
      req.user?.id
    ));
  }

  @Patch('/instances/:id/restore')
  @ApiResponse({ status: 201, type: InstanceVm })
  @ApiOperation({ summary: 'Restore an instance' })
  @Version('1')
  async restoreInstance(
    @ParamId({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas"
    }) instanceId: string,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(await this.instanceService.restore(
      instanceId, 
      req.user?.id
    ));
  }

  @Get('/:appId/instances')
  @Pagination()
  @ApiResponse({ status: 201, type: PaginationVm })
  @ApiOperation({ summary: 'Find all instances for an application' })
  @Version('1')
  async getAppInstances(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas",
      key: 'appId'
    }) appId: string,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(await this.instanceService.findAll(
      req.pagination,
      { application_id: appId }
    ));
  }

  @Get('/instances/:id')
  @ApiResponse({ status: 201, type: InstanceVm })
  @ApiOperation({ summary: 'Find an instance' })
  @Version('1')
  async findInstance(
    @ParamId({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas"
    }) instanceId: string
  ) {
    return InstanceVm.create(await this.instanceService.findOne(
      instanceId
    ));
  }

  @Get()
  @Pagination()
  @ApiResponse({ status: 200, type: ApplicationVm, isArray: true })
  @ApiOperation({ summary: 'Get all applications' })
  @Version('1')
  async findAll(
    @Req() req: CustomRequest,
    @Query() filter: FilterApplicationDto
  ) {
    return ApplicationVm.createPaginated(await this.applicationService.findAll(req.pagination, filter)); 
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: ApplicationVm })
  @ApiOperation({ summary: 'Get application by id' })
  @Version('1')
  async findOne(
    @ParamEntity({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas",
      options: {
        include: {
          instances: true,
          app_configs: true
        }
      }
    })
    application: ApplicationEntity
  ) {
    return ApplicationVm.create(application);
  }

  @Patch('/instances/:id')
  @Transaction()
  @ApiResponse({ status: 201, type: InstanceVm })
  @ApiOperation({ summary: 'Update a new instance' })
  @Version('1')
  async updateInstance(
    @ParamId({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas !"
    }) instanceId: string,
    @Body() data: UpdateInstanceDto,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(await this.instanceService.update(
      instanceId,
      data, 
      req.user?.id
    ));
  }

  @Patch(':id/configs')
  @Transaction()
  @ApiResponse({ status: 200, type: ApplicationVm })
  @ApiOperation({ summary: 'Update application configs by id' })
  @Version('1')
  async updateConfigs(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas"
    })
    applicationId: string,
    @Body() data: UpdateApplicationConfigDto,
    @Req() req: CustomRequest
  ) {
    return ApplicationVm.create(await this.applicationService.updateConfigs(applicationId, data, req.user?.id));
  }

  @Patch(':id/configs/reset')
  @Transaction()
  @ApiResponse({ status: 200, type: ApplicationVm })
  @ApiOperation({ summary: 'Reset application configs by id' })
  @Version('1')
  async resetConfigs(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas"
    })
    applicationId: string,
    @Req() req: CustomRequest,
  ) {
    return ApplicationVm.create(await this.applicationService.resetConfigs(applicationId, req.user?.id));
  }

  @Patch('/instances/:id/configs')
  @Transaction()
  @ApiResponse({ status: 200, type: InstanceVm })
  @ApiOperation({ summary: 'Update instance configs by id' })
  @Version('1')
  async updateInstanceConfigs(
    @ParamId({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas"
    })
    instanceId: string,
    @Body() data: UpdateInstanceConfigDto,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(
      await this.instanceService.updateInstanceConfigs(
        instanceId, 
        data, 
        req.user?.id
      )
    );
  }

  @Patch('/instances/:id/configs/reset')
  @Transaction()
  @ApiResponse({ status: 200, type: InstanceVm })
  @ApiOperation({ summary: 'Reset instance configs by id' })
  @Version('1')
  async resetInstanceConfigs(
    @ParamEntity({
      model: ModelMappingTable.INSTANCE,
      errorMessage: "L'instance n'existe pas"
    })
    instance: InstanceEntity,
    @Body() data: ResetInstanceConfigDto,
    @Req() req: CustomRequest
  ) {
    return InstanceVm.create(
      await this.instanceService.resetInstanceConfigs(
        instance,
        data,
        req.user?.id
      )
    );
  }

  @Patch(':id')
  @Transaction()
  @ApiResponse({ status: 200, type: ApplicationVm })
  @ApiOperation({ summary: 'Update application by id' })
  @Version('1')
  async update(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas"
    })
    applicationId: string,
    @Body() data: UpdateApplicationDto,
    @Req() req: CustomRequest
  ) {
    return ApplicationVm.create(await this.applicationService.update(applicationId, data, req.user?.id));
  }

  
  @Delete(':id/soft')
  @ApiResponse({
    status: 200,
    type: ApplicationVm,
  })
  @ApiOperation({ summary: 'Soft delete an application' })
  @Version('1')
  async softDelete(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas",
    })
    applicationId: string,
  ) {
    return ApplicationVm.create(
      await this.applicationService.softDelete(applicationId),
    );
  }

  
  @Patch(':id/restore')
  @ApiResponse({
    status: 200,
    type: ApplicationVm,
  })
  @ApiOperation({ summary: 'Restore an application' })
  @Version('1')
  async restore(
    @ParamId({
      model: ModelMappingTable.APPLICATION,
      errorMessage: "L'application n'existe pas",
    })
    applicationId: string,
  ) {
    return ApplicationVm.create(
      await this.applicationService.restore(applicationId),
    );
  }
}
