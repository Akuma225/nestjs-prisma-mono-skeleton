import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CustomRequest } from 'src/commons/interfaces/custom_request'
import { SecurityService } from 'src/commons/services/security.service'
import { PrismaService } from '../services/prisma.service'
import { UserData } from '../shared/entities/user-data.entity'
import { Profile } from '../enums/profile.enum'

@Injectable()
export class IdentificationGuard implements CanActivate {
  constructor(
    private securityService: SecurityService,
    private prismaService: PrismaService,
    private configService: ConfigService
  ) { }

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
    const resultJwt = this.securityService.verifyJwt(
      token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET')
    )

    Logger.log(resultJwt)

    if (!resultJwt) {
      Logger.log('Invalid JWT Token...')
      return true
    }

    const userData = new UserData(resultJwt.sub)

    const user = await this.prismaService.users.findUnique({
      where: {
        id: userData.id
      }
    })

    // Check if user exists
    if (!user) {
      Logger.log('User not found...')
      return true
    }

    // Check if user is active
    if (!user.is_active) {
      Logger.log('User is not active...')
      return true
    }

    // Check if user is not deleted
    if (user.deleted_at) {
      Logger.log('User is deleted...')
      return true
    }

    // Check if user auto login token is valid
    if (user.auto_login_token !== userData.auto_login_token) {
      Logger.log('Invalid Auto Login Token...')
      return true
    }

    // Ajouter les données de l'utilisateur à la requête

    request.user = userData

    // Activate extended audit
    request.extended_audit = [Profile.ADMIN].includes(userData.profile)

    return true
  }
}
