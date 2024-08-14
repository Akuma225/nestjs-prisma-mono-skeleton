import { Request } from 'express'
import { IPaginationParams } from './pagination-params'
import { UserData } from '../shared/entities/user-data.entity'

/**
 * Represents a custom request object that extends the base Request interface.
 */
export interface CustomRequest extends Request {
  pagination: IPaginationParams
  user: UserData
  extended_audit: boolean
  transaction?: boolean,
  prismaTransaction?: any;
  savedFiles?: string[]
}
