import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CustomRequest } from 'src/commons/interfaces/custom_request'

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() { }

  /**
   * Determines if the user is authenticated.
   * @param context - The execution context of the route.
   * @returns A boolean indicating if the user is authenticated.
   * @throws HttpException if the user is not authenticated.
   */
  async canActivate(context: ExecutionContext) {
    Logger.log('Launching Authentication Guard...')

    const request: CustomRequest = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new HttpException(
        'Accès non autorisé. Token invalide ou manquant.',
        401
      )
    }

    return true
  }
}
