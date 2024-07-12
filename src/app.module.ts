import { Global, MiddlewareConsumer, Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { IdentificationGuard } from './commons/guards/identification.guard';
import { PrismaService } from './commons/services/prisma.service';
import { PaginationMiddleware } from './commons/middlewares/pagination.middleware';
import { AuthModule } from './resources/auth/auth.module';
import { ViewmodelService } from './commons/services/viewmodel.service';
import { ProductModule } from './resources/product/product.module';
import { CategoryModule } from './resources/category/category.module';
import { PrismaServiceProvider } from './commons/providers/prisma-service.provider';
import { PaginationService } from './commons/services/pagination.service';
import { PaginationServiceProvider } from './commons/providers/pagination-service.provider';
import { RedisService } from './commons/services/redis.service';
import { RedisServiceProvider } from './commons/providers/redis-service.provider';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RequestContextService } from './commons/services/request-context.service';
import { RequestContextInterceptor } from './commons/interceptors/request-context.interceptor';
import { IsUniqueConstraint } from './commons/decorators/is-unique.decorator';
import { RequestContextServiceProvider } from './commons/providers/request-context-service.provider';
import { IsDataExistsConstraint } from './commons/decorators/is-data-exists.decorator';
import { ViewmodelServiceProvider } from './commons/providers/viewmodel-service.provider';
import { SecurityService } from './commons/services/security.service';

/**
 * Module principal de l'application.
 * Configuré comme global pour fournir des services et fonctionnalités communs à toute l'application.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Assure que le ConfigModule est global
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    // Modules de ressources
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  providers: [
    // Interceptors globaux
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    // Guards globaux
    {
      provide: APP_GUARD,
      useClass: IdentificationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Services principaux
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationService,
    PaginationServiceProvider,
    RedisService,
    RedisServiceProvider,
    RequestContextService,
    RequestContextServiceProvider,
    SecurityService,
    // Decorators personnalisés
    IsUniqueConstraint,
    IsDataExistsConstraint,
  ],
  exports: [
    // Exporte les services globaux pour être utilisés dans d'autres modules
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationServiceProvider,
    PaginationService,
    RedisService,
    RedisServiceProvider,
    RequestContextService,
    RequestContextServiceProvider,
    SecurityService,
    IsUniqueConstraint,
    IsDataExistsConstraint,
  ],
})
export class AppModule implements OnModuleInit {
  /**
   * Construit le module AppModule.
   * @param {ViewmodelService} viewmodelService - Service de gestion des view models.
   * @param {PrismaService} prismaService - Service d'accès aux données avec Prisma.
   * @param {PaginationService} paginationService - Service de pagination des données.
   * @param {RedisService} redisService - Service de gestion de la base de données Redis.
   * @param {RequestContextService} requestContextService - Service de contexte de requête.
   */
  constructor(
    private readonly viewmodelService: ViewmodelService,
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly redisService: RedisService,
    private readonly requestContextService: RequestContextService,
  ) { }

  /**
   * Configure le middleware de pagination pour toutes les routes HTTP GET de l'application.
   * @param {MiddlewareConsumer} consumer - Consommateur de middleware pour configurer les middleware.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(PaginationMiddleware).forRoutes({ path: '*', method: RequestMethod.GET });
  }

  /**
   * Fonction du cycle de vie appelée lors de l'initialisation du module.
   * Définit les services globaux pour leur utilisation dans toute l'application.
   */
  onModuleInit(): void {
    ViewmodelServiceProvider.setService(this.viewmodelService);
    PrismaServiceProvider.setService(this.prismaService);
    PaginationServiceProvider.setService(this.paginationService);
    RedisServiceProvider.setService(this.redisService);
    RequestContextServiceProvider.setService(this.requestContextService);
  }
}
