import { Injectable, Logger } from '@nestjs/common'
import { PaginationVm } from '../shared/viewmodels/pagination.vm'
import { PrismaService } from './prisma.service'
import { IPaginationParams } from '../interfaces/pagination-params'

@Injectable()
export class PaginationService {
  constructor(private prisma: PrismaService) { }

  /**
   * Retrieves paginated data based on the provided parameters.
   *
   * @param model - The name of the model to query.
   * @param where - The conditions to filter the data.
   * @param include - The associations to include in the query.
   * @param orderBy - The sorting order of the data.
   * @param params - The pagination parameters.
   * @returns A Promise that resolves to a PaginationVm object containing the paginated data.
   */
  async paginate(
    model: string,
    where: any,
    include: any,
    orderBy: any[],
    params: IPaginationParams
  ): Promise<PaginationVm> {
    const DEFAULT_LIMIT = 10
    const DEFAULT_PAGE = 1

    const limit = params.limit || DEFAULT_LIMIT
    const page = params.page || DEFAULT_PAGE

    if (
      params.is_deleted_too !== undefined &&
      where.deleted_at &&
      params.is_deleted_too
    ) {
      delete where.deleted_at
    }

    if (params.is_deleted_only !== undefined && params.is_deleted_only) {
      where = {
        ...where,
        deleted_at: {
          not: null,
        },
      }
    }

    // If order parameter is provided, split it by comma and map it to the orderBy array. Example: order=category.name,asc => orderBy: [{ category: { name: 'asc' } }]

    if (params.order) {
      orderBy = this.generateOrderBy(params)
    }

    // If the all parameter is set to true, return all results without pagination.
    if (params.all) {
      const data = await this.prisma[model].findMany({
        where,
        include,
        orderBy,
      })

      const result: PaginationVm = {
        currentPage: 1,
        previousPage: null,
        nextPage: null,
        count: data.length,
        totalCount: data.length,
        totalPages: 1,
        result: data,
      }

      return result
    }

    const skip = (params.page - 1) * limit

    Logger.log(`
      Pagination service:
      model: ${model},
      where: ${JSON.stringify(where)},
      include: ${JSON.stringify(include)},
      orderBy: ${JSON.stringify(orderBy)},
      page: ${params.page},
      limit: ${limit},
      skip: ${skip},
    `)

    const data = await this.prisma[model].findMany({
      where,
      include,
      orderBy,
      skip,
      take: limit,
    })

    const result: PaginationVm = {
      currentPage: params.page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: data.length === limit ? page + 1 : null,
      count: data.length,
      totalCount: await this.prisma[model].count({ where }),
      totalPages: Math.ceil(
        (await this.prisma[model].count({ where })) / limit
      ),
      result: data,
    }

    return result
  }

  /**
   * Generates an array of orderBy objects based on the provided pagination parameters.
   * Each orderBy object represents a sorting criteria for the query.
   *
   * @param params - The pagination parameters containing the order string.
   * @returns An array of orderBy objects.
   */
  generateOrderBy(params: IPaginationParams): any[] {
    let orderBy: any[] = []

    const order = params.order.split(',')
    orderBy = order.map((item) => {
      const [key, value] = item.split(':')
      const keys = key.split('.')
      if (keys.length === 1) {
        return { [keys[0]]: value }
      } else {
        // Creating nested objects for keys like 'category.name'
        let nestedObject = {}
        let currentLevel = nestedObject
        keys.forEach((k, index) => {
          if (index === keys.length - 1) {
            currentLevel[k] = value
          } else {
            currentLevel[k] = {}
            currentLevel = currentLevel[k]
          }
        })
        return nestedObject
      }
    })

    return orderBy
  }
}
