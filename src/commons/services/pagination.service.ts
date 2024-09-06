import { Injectable, Logger } from '@nestjs/common'
import { PaginationVm } from '../shared/viewmodels/pagination.vm'
import { PrismaService } from './prisma.service'
import { IPaginationParams } from '../interfaces/pagination-params'
import { PaginateOptions } from '../interfaces/services/pagination/paginate-options'

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
  async paginate(options: PaginateOptions): Promise<PaginationVm> {
    let { params, where, include, searchables, select, orderBy, model } = options;
  
    const DEFAULT_LIMIT = 10;
    const DEFAULT_PAGE = 1;
  
    const limit = params.limit || DEFAULT_LIMIT;
    const page = params.page || DEFAULT_PAGE;
  
    if (
      params.is_deleted_too !== undefined &&
      where.deleted_at &&
      params.is_deleted_too
    ) {
      delete where.deleted_at;
    }
  
    if (params.is_deleted_only !== undefined && params.is_deleted_only) {
      where = {
        ...where,
        deleted_at: {
          not: null,
        },
      };
    }
  
    if (params.order) {
      const generateOrderBy = this.generateOrderBy(params);
      orderBy = [...orderBy, ...generateOrderBy];
    }
  
    if (params.search && searchables) {
      where = this.generateSearchQuery(params.search, searchables, where);
    }
  
    const skip = params.load_previous_pages 
      ? 0 
      : (page - 1) * limit;
  
    const take = params.load_previous_pages 
      ? page * limit 
      : limit;
  
    if (params.all) {
      const data = await this.prisma[model].findMany({
        where,
        include,
        orderBy,
      });
  
      const result: PaginationVm = {
        currentPage: 1,
        previousPage: null,
        nextPage: null,
        count: data.length,
        totalCount: data.length,
        totalPages: 1,
        result: data,
      };
  
      return result;
    }
  
    Logger.log(`
      Pagination service:
      model: ${model},
      where: ${JSON.stringify(where)},
      include: ${JSON.stringify(include)},
      orderBy: ${JSON.stringify(orderBy)},
      page: ${params.page},
      Select: ${JSON.stringify(select)},
      limit: ${limit},
      skip: ${skip},
      take: ${take},
    `);
  
    const data = await this.prisma[model].findMany({
      where,
      include,
      orderBy,
      skip,
      select: !include ? select : undefined,
      take,
    });
  
    const totalCount = await this.prisma[model].count({ where });
  
    const result: PaginationVm = {
      currentPage: params.page,
      previousPage: page > 1 ? page - 1 : null,
      nextPage: (skip + data.length < totalCount) ? page + 1 : null,
      count: data.length,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      result: data,
    };
  
    return result;
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

  /**
   * Creates a nested search object based on the given path and value.
   * @param path - An array of strings representing the path to the nested property.
   * @param value - The value to search for.
   * @returns The nested search object.
   */
  createNestedSearchObject(path: string[], value: string): any {
    if (path.length === 1) {
      return {
        [path[0]]: {
          contains: value,
          mode: 'insensitive',
        },
      };
    }
    const key = path.shift();
    return {
      [key]: this.createNestedSearchObject(path, value),
    };
  }

  /**
   * Merges two OR where clauses into a single OR where clause.
   * If the initial where clause is empty or the another where clause is empty, the initial where clause is returned.
   * If the initial where clause does not have an OR property, the another where clause is added as the OR property.
   * If the initial where clause already has an OR property, the another where clause is appended to the existing OR property.
   * 
   * @param initialWhere - The initial where clause.
   * @param anotherWhere - The another where clause to merge.
   * @returns The merged OR where clause.
   */
  mergeORWhereClauses(initialWhere: any, anotherWhere: any): any {
    if (!initialWhere || Object.keys(anotherWhere).length === 0) {
      return initialWhere;
    }

    if (!initialWhere.OR) {
      return {
        ...initialWhere,
        OR: anotherWhere.OR,
      };
    }

    return {
      ...initialWhere,
      OR: [...initialWhere.OR, ...anotherWhere.OR]
    };
  }

  /**
   * Generates a search query based on the provided search term, searchables, and current where clause.
   * @param search - The search term to look for.
   * @param searchables - An array of strings representing the fields to search in.
   * @param currentWhere - The current where clause to merge the search conditions with.
   * @returns The merged where clause with the search conditions.
   */
  generateSearchQuery(search: string, searchables: string[], currentWhere: any): any {
    Logger.log(`Searching for ${search} in ${searchables.join(', ')}`);
    const searchConditions = searchables.map((searchable) => {
      const path = searchable.split('.');
      return this.createNestedSearchObject(path, search);
    });

    const searchWhereClause = { OR: searchConditions };

    Logger.log(`Search where clause: ${JSON.stringify(searchWhereClause)}`);
    return this.mergeORWhereClauses(currentWhere, searchWhereClause);
  }
}
