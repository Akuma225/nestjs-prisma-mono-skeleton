import { ApiProperty } from '@nestjs/swagger';

export class PaginationVm {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  previousPage: number;

  @ApiProperty()
  nextPage: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  result: any[];
}
