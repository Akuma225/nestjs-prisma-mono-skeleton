import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common'
import { CustomRequest } from 'src/commons/interfaces/custom_request'
import { SecurityService } from '../services/security.service'
import { ConfigService } from '@nestjs/config'
import { UserData } from '../shared/entities/user-data.entity'
import { AdminData } from '../shared/entities/admin-data.entity'
import { PrismaService } from '../services/prisma.service'

/**
 * A guard that checks if the user is authenticated before allowing access to a route.
 */
@Injectable()
export class AdminAuthenticationGuard implements CanActivate {
  constructor(
    private securityService: SecurityService,
    private configService: ConfigService,
    private readonly prismaService: PrismaService
  ) { }

  /**
   * Determines if the user is authenticated.
   * @param context - The execution context of the route.
   * @returns A boolean indicating if the user is authenticated.
   * @throws HttpException if the user is not authenticated.
   */
  async canActivate(context: ExecutionContext) {
    Logger.log('Launching Admin Authentication Guard...')

    const request: CustomRequest = context.switchToHttp().getRequest()

    if (!request.headers['authorization']) {
      Logger.log('Missing Token in Authorization Header...')
      throw new HttpException("Vous devez être connecté pour accéder à cette ressource", HttpStatus.UNAUTHORIZED)
    }

    const token = request.headers['authorization'].split(' ')[1]

    if (!token) {
      Logger.log('Malformed Token from Bearer...')
      throw new HttpException("Vous devez être connecté pour accéder à cette ressource", HttpStatus.UNAUTHORIZED)
    }

    // Verify token JWT
    const resultJwt = this.securityService.verifyJwt(
      token,
      this.configService.get<string>('ACCESS_TOKEN_SECRET')
    )

    Logger.log(resultJwt)

    if (!resultJwt) {
      Logger.log('Invalid JWT Token...')
      throw new HttpException("Vous devez être connecté pour accéder à cette ressource", HttpStatus.UNAUTHORIZED)
    }

    const adminData = new AdminData(resultJwt)

    const admin = await this.prismaService.admins.findUnique({
      where: {
        id: adminData.id
      }
    })

    if (!admin) {
      Logger.log('Admin not found...')
      throw new HttpException("Vous devez être connecté pour accéder à cette ressource", HttpStatus.UNAUTHORIZED)
    }

    if (admin.auto_login_token !== adminData.auto_login_token) {
      Logger.log('Token invalidated...')
      throw new HttpException("Vous devez être connecté pour accéder à cette ressource", HttpStatus.UNAUTHORIZED)
    }

    request.admin = admin

    Logger.log('Admin Guard Passed...')

    return true
  }
}
