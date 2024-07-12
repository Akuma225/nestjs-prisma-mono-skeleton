import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, NextFunction } from 'express'
import { CustomRequest } from '../interfaces/custom_request'

/**
  * Middleware to handle pagination parameters in GET requests.
  * @param req - The custom request object.
  * @param _res - The response object (not used in this middleware).
  * @param next - The next function to call in the middleware chain.
  */
@Injectable()
export class PaginationMiddleware implements NestMiddleware {
  use(req: CustomRequest, _res: Response, next: NextFunction) {
    if (req.method === 'GET') {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 20
      const all = req.query.all === 'true'
      const search = req.query.search as string
      const is_deleted_too = req.query.is_deleted_too === 'true'
      const is_deleted_only = req.query.is_deleted_only === 'true'
      const order = req.query.order as string

      req.pagination = {
        page,
        limit,
        all,
        search,
        is_deleted_too,
        is_deleted_only,
        order,
      }
    }

    next()
  }
}
