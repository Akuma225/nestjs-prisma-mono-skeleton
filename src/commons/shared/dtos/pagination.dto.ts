import { ApiProperty } from '@nestjs/swagger';
import { PaginationVm } from '../viewmodels/pagination.vm';

export class PaginationDto<TData> {
  @ApiProperty()
  success: boolean;

  data: TData[];

  @ApiProperty()
  message: string;

  @ApiProperty()
  pagination: PaginationVm;
}
