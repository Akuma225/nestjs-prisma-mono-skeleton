import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export const Pagination = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of results per page',
    }),
    ApiQuery({
      name: 'all',
      required: false,
      type: Boolean,
      description: 'Return all results',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Search query',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      type: String,
      description: 'Order by column',
    }),
    ApiQuery({
      name: 'is_deleted_too',
      required: false,
      type: Boolean,
      description: 'Return results including deleted items',
    }),
    ApiQuery({
      name: 'is_deleted_only',
      required: false,
      type: Boolean,
      description: 'Return results including only deleted items',
    })
  )
