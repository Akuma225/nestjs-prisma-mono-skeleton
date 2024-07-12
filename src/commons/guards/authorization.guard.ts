import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Profile } from '../enums/profile.enum'
import { UserData } from '../shared/entities/user-data.entity'

/**
  * Determines if the user is authorized to access the requested resource.
  * @param context - The execution context of the request.
  * @returns A boolean indicating whether the user is authorized.
  * @throws HttpException with status 401 if the user is not authenticated.
  * @throws HttpException with status 403 if the user does not have access to the resource.
  */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    let profiles = this.reflector.getAllAndOverride<Array<Profile>>(
      'profiles',
      [context.getHandler(), context.getClass()]
    )

    if (!profiles) {
      // If there is no profile, it means that the route is for all profiles. So take all profiles from the enum
      profiles = Object.values(Profile)
    }

    Logger.log('Launching Authorization Guard...')
    Logger.log(`Checking for profiles: ${profiles.join(', ')}`)

    const request = context.switchToHttp().getRequest()
    const user: UserData = request.user

    if (!user) {
      throw new HttpException('Accès non autorisé.', 401)
    }

    if (user.profile === Profile.SUPER_ADMIN) {
      return true
    }

    if (!profiles.includes(user.profile)) {
      throw new HttpException("Vous n'avez pas accès à cette ressource !", 403)
    }

    return true
  }
}
