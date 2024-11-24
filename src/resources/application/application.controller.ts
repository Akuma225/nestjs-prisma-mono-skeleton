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

@ApiTags('Applications')
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

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
      errorMessage: "L'application n'existe pas"
    })
    application: ApplicationEntity
  ) {
    return ApplicationVm.create(application);
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
