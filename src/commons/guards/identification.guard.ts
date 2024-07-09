import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CustomRequest } from 'src/commons/interfaces/custom_request'
import { SecurityService } from 'src/commons/services/security.service'

@Injectable()
export class IdentificationGuard implements CanActivate {
  constructor(private securityService: SecurityService) { }

  async canActivate(context: ExecutionContext) {
    Logger.log('Launching Identification Guard...')
    const request: CustomRequest = context.switchToHttp().getRequest()

    // Set default values
    request.user = null
    request.extended_audit = false

    if (!request.headers['authorization']) {
      Logger.log('Missing Token in Authorization Header...')
      return true
    }

    const token = request.headers['authorization'].split(' ')[1]

    if (!token) {
      Logger.log('Malformed Token from Bearer...')
      return true
    }

    // Verify token JWT
    const resultJwt = await this.securityService.verifyAccessToken(token)

    Logger.log(resultJwt)

    if (!resultJwt) {
      Logger.log('Invalid JWT Token...')
      return true
    }

    // Ajouter les données de l'utilisateur à la requête

    request.user = resultJwt.sub
    request.extended_audit = true

    return true
  }
}
