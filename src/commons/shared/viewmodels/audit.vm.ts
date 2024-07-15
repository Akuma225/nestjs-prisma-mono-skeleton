import { ApiResponseProperty } from '@nestjs/swagger';
import { UserMinVm } from './user.min.vm';

export class AuditVm {
  @ApiResponseProperty()
  created_at: Date;

  @ApiResponseProperty()
  created_by?: UserMinVm;

  @ApiResponseProperty()
  updated_at: Date;

  @ApiResponseProperty()
  updated_by: UserMinVm;

  @ApiResponseProperty()
  deleted_at: Date;

  @ApiResponseProperty()
  deleted_by: UserMinVm;

  constructor(data) {
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;

    this.created_by = data.created_by;
    this.updated_by = data.updated_by;
    this.deleted_by = data.deleted_by;
  }
}
