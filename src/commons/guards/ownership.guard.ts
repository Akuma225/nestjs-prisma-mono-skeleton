import { Injectable, CanActivate, ExecutionContext, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
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
    const request: CustomRequest = context.switchToHttp().getRequest<CustomRequest>();
    const user = request.user;

    // Vérifier le rôle de l'utilisateur
    if ([Profile.ADMIN, Profile.SUPER_ADMIN].includes(user.profile)) {
      return true; // Autoriser l'accès
    }

    // Récupérer les métadonnées du décorateur
    const target = this.reflector.get<string>('verify-ownership-target', context.getHandler());
    const key = this.reflector.get<string>('verify-ownership-key', context.getHandler()) || 'id';
    const table = this.reflector.get<string>('verify-ownership-table', context.getHandler());
    const propertyPath = this.reflector.get<string>('verify-ownership-propertyPath', context.getHandler());

    // Récupérer l'id de la ressource à partir des paramètres de la requête
    const resourceId = this.getResourceId(request, target, key);

    // Vérifier la propriété
    const isOwner = await this.checkOwnership(user.id, resourceId, table, propertyPath);

    if (!isOwner) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à accéder à cette ressource');
    }

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

  private async checkOwnership(userId: string, resourceId: string, table: string, propertyPath: string): Promise<boolean> {
    // Construire une requête dynamique avec Prisma
    const resource = await this.prisma[table].findUnique({
      where: {
        [propertyPath]: resourceId,
      },
    });

    return resource && this.isOwner(resource, userId, propertyPath);
  }

  private isOwner(resource: any, userId: string, propertyPath: string): boolean {
    const properties = propertyPath.split('.');
    let currentValue = resource;

    for (const prop of properties) {
      if (!currentValue) return false;
      currentValue = currentValue[prop];
    }

    return currentValue === userId;
  }
}
