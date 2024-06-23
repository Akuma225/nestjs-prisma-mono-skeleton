import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CustomRequest } from 'src/commons/interfaces/custom_request'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() {}

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
