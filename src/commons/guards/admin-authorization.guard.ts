import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { CustomRequest } from 'src/commons/interfaces/custom_request'
import { AdminProfile } from '../enums/admin-profile.enum'

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 */
@Injectable()
export class AdminAuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the user is authenticated.
   * @param context - The execution context of the route.
   * @returns A boolean indicating if the user is authenticated.
   * @throws HttpException if the user is not authenticated.
   */
  async canActivate(context: ExecutionContext) {
    Logger.log('Launching Admin Authorization Guard...')

    const request: CustomRequest = context.switchToHttp().getRequest()

    if (!request.admin) {
      throw new HttpException(
        'Accès non autorisé. Token invalide ou manquant.',
        HttpStatus.UNAUTHORIZED
      )
    }

    const requiredProfiles = this.reflector.getAllAndOverride<Array<AdminProfile>>(
      'REQUIRED_ADMIN_PROFILES',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredProfiles) {
      Logger.log('No required profiles found...')
      return true
    }

    if (!requiredProfiles.includes(AdminProfile[request.admin.profile])) {
      Logger.log('Unauthorized profile...')
      throw new HttpException(
        'Accès non autorisé. Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.',
        HttpStatus.FORBIDDEN
      )
    }

    Logger.log('Authorized admin profile...')

    return true
  }
}
