import { Global, MiddlewareConsumer, Module, OnModuleInit, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { ResponseInterceptor } from './commons/interceptors/response.interceptor';
import { IdentificationGuard } from './commons/guards/identification.guard';
import { BootstrapService } from './commons/services/bootstrap.service';
import { PrismaService } from './commons/services/prisma.service';
import { PaginationMiddleware } from './commons/middlewares/pagination.middleware';
import { AuthModule } from './resources/auth/auth.module';
import { SecurityService } from './commons/services/security.service';
import { ViewmodelServiceProvider } from './commons/providers/viewmodelservice.provider';
import { ViewmodelService } from './commons/services/viewmodel.service';
import { ProductModule } from './resources/product/product.module';
import { CategoryModule } from './resources/category/category.module';
import { PrismaServiceProvider } from './commons/providers/prismaservice.provider';
import { PaginationService } from './commons/services/pagination.service';
import { PaginationServiceProvider } from './commons/providers/paginationservice.provider';
import { RedisService } from './commons/services/redis.service';
import { RedisServiceProvider } from './commons/providers/redisservice.provider';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RequestContextService } from './commons/services/request-context.service';
import { RequestContextInterceptor } from './commons/interceptors/request-context.interceptor';
import { IsUniqueConstraint } from './commons/decorators/is-unique.decorator';
import { RequestContextServiceProvider } from './commons/providers/request-context-service.provider';
import { IsDataExistsConstraint } from './commons/decorators/is-data-exists.decorator';

@Global() // Marque le module comme global
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Assurez-vous que le ConfigModule est global
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),

    // Modules de ressources
    AuthModule,
    ProductModule,
    CategoryModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: IdentificationGuard,
    },

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    PrismaService,
    PrismaServiceProvider,
    ViewmodelService,
    ViewmodelServiceProvider,
    PaginationService,
    PaginationServiceProvider,
    SecurityService,
    BootstrapService,
    RedisService,
    RedisServiceProvider,
    RequestContextService,
    RequestContextServiceProvider,
    IsUniqueConstraint,
    IsDataExistsConstraint
  ],
  exports: [PrismaService, PrismaServiceProvider, ViewmodelServiceProvider, ViewmodelService, PaginationServiceProvider, PaginationService, RedisService, RedisServiceProvider, SecurityService, RequestContextService, RequestContextServiceProvider, IsUniqueConstraint, IsDataExistsConstraint], // Exporte les services globaux
})
export class AppModule implements OnModuleInit {

  constructor(
    private readonly viewmodelService: ViewmodelService,
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly redisService: RedisService,
    private readonly requestContextService: RequestContextService,
  ) { }

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }

  onModuleInit() {
    ViewmodelServiceProvider.setViewmodelService(this.viewmodelService);
    PrismaServiceProvider.setPrismaService(this.prismaService);
    PaginationServiceProvider.setPaginationService(this.paginationService);
    RedisServiceProvider.setRedisService(this.redisService);
    RequestContextServiceProvider.setRequestContextService(this.requestContextService);
  }
}
