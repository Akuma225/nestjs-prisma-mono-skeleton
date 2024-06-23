import { Request } from 'express'
import { IPaginationParams } from './pagination-params'
import { AccessTokenData } from '../shared/entities/access-token-data.entity'

export interface CustomRequest extends Request {
  pagination: IPaginationParams
  user: AccessTokenData
  extended_audit: boolean
}
