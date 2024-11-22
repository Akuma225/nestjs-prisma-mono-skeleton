import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/commons/services/prisma.service';
import { CustomRequest } from '../interfaces/custom_request';
import { Profile } from '../enums/profile.enum';

@Injectable()
export class VerifyOwnershipGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    Logger.log('Vérification de l\'appartenance à la ressource');

    const request: CustomRequest = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    // Vérifier le rôle de l'utilisateur
    /*if ([Profile.ADMIN, Profile.SUPER_ADMIN].includes(user.profile)) {
      return true; // Autoriser l'accès
    }*/

    // Récupérer les métadonnées du décorateur
    const target = this.reflector.get<string>('verify-ownership-target', context.getHandler());
    const key = this.reflector.get<string>('verify-ownership-key', context.getHandler()) || 'id';
    const table = this.reflector.get<string>('verify-ownership-table', context.getHandler());
    const tableProperty = this.reflector.get<string>('verify-ownership-tableProperty', context.getHandler());
    const propertyPath = this.reflector.get<string>('verify-ownership-propertyPath', context.getHandler());

    // Récupérer l'id de la ressource à partir des paramètres de la requête
    const resourceId = this.getResourceId(request, target, key);
    Logger.log(resourceId);

    const data = await this.getDataFromDB(table, tableProperty, resourceId);
    Logger.log(data);

    // Vérifier l'appartenance à la ressource
    await this.checkOwnership(data, propertyPath, user);

    return true;
  }

  private getResourceId(request: CustomRequest, target: string, key: string): string {
    switch (target) {
      case 'body':
        return request.body[key];
      case 'params':
        return request.params[key];
      case 'query':
        return request.query[key].toString();
      default:
        throw new HttpException('Target invalide', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private getDataFromDB(table: string, tableProperty: string, resourceId: string) {
    return this.prisma[table].findUnique({
      where: {
        [tableProperty]: resourceId,
      },
    });
  }

  private async checkOwnership(data: any, propertyPath: string, user: any) {
    const propertyValue = this.getPropertyData(data, propertyPath);
    Logger.log('PropertyValue')
    Logger.log(propertyValue);
    Logger.log('UserId')
    Logger.log(user.id);
    
    if (propertyValue !== user.id) {
      throw new HttpException('Vous n\'êtes pas autorisé à accéder à cette ressource', HttpStatus.FORBIDDEN);
    }
  }

  private getPropertyData(data, propertyPath: string) {
    return propertyPath.split('.').reduce((acc, prop) => acc[prop], data);
  }
}
