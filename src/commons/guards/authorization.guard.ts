import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Profile } from '../enums/profile.enum'

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let profiles = this.reflector.getAllAndOverride<Array<Profile>>(
      'admin_profiles',
      [context.getHandler(), context.getClass()]
    )

    if (!profiles) {
      // If there is no profile, it means that the route is for all profiles. So take all profiles from the enum
      profiles = Object.values(Profile)
    }

    Logger.log('Launching Authorization Guard...')
    Logger.log(`Checking for profiles: ${profiles.join(', ')}`)

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new HttpException('Accès non autorisé.', 401)
    }

    if (!user.admins || user.admins.length === 0) {
      throw new HttpException("Vous n'avez pas accès à cette ressource !", 403)
    }

    const admin = user.admins[0]

    if (admin.profile === Profile.SUPER_ADMIN) {
      return true
    }

    if (!profiles.includes(admin.profile)) {
      throw new HttpException("Vous n'avez pas accès à cette ressource !", 403)
    }

    return true
  }
}
