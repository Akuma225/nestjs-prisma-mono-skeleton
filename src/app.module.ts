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

@Global() // Marque le module comme global
@Module({
  imports: [
  ConfigModule.forRoot({
      isGlobal: true, // Assurez-vous que le ConfigModule est global
    }),
    
    // Modules de ressources
    AuthModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: IdentificationGuard,
    },
    PrismaService,
    SecurityService,
    BootstrapService,
    ViewmodelService,
    ViewmodelServiceProvider
  ],
  exports: [PrismaService, SecurityService, ViewmodelServiceProvider, ViewmodelService], // Exporte les services globaux
})
export class AppModule implements OnModuleInit {
  
  constructor(private readonly viewmodelService: ViewmodelService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PaginationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET });
  }

  onModuleInit() {
    ViewmodelServiceProvider.setViewmodelService(this.viewmodelService);
  }
}
