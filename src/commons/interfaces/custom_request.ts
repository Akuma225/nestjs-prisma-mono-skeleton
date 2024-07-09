import { Request } from 'express'
import { IPaginationParams } from './pagination-params'
import { UserData } from '../shared/entities/user-data.entity'

export interface CustomRequest extends Request {
  pagination: IPaginationParams
  user: UserData
  extended_audit: boolean
}
