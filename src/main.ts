import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { LifecycleService } from './commons/lifecycles/LifecycleService';
//import { PrismaClientExceptionFilter } from './commons/filters/prisma-client-exception/prisma-client-exception.filter';
import { useContainer } from 'class-validator';

/**
 * Fonction principale de démarrage de l'application NestJS.
 * Configure et lance l'application avec toutes les fonctionnalités nécessaires.
 */
async function bootstrap() {
  // Crée une instance de l'application NestJS basée sur NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true, // Active la gestion des CORS pour l'application
  });

  // Récupère les valeurs des variables d'environnement
  const APP_NAME = process.env.APP_NAME;
  const BACK_OFFICE_DESCRIPTION = process.env.BACK_OFFICE_DESCRIPTION;
  const APP_VERSION = process.env.APP_VERSION;

  // Récupère l'adaptateur HTTP de l'application
  const { httpAdapter } = app.get(HttpAdapterHost);

  // Configure le middleware pour parser les corps de requête JSON
  app.use(bodyParser.json());

  // Configure les CORS pour l'application
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, captcha-key, Wave-Signature'
    ],
    credentials: true,
  });

  // Configure le filtre global pour les exceptions PrismaClient
  //app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Utilise le conteneur de NestJS pour class-validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Configure le pipe global de validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Configure les fichiers statiques à servir depuis le dossier 'assets'
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });

  // Configure Swagger pour générer la documentation API
  const configBackOffice = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(BACK_OFFICE_DESCRIPTION)
    .setVersion(APP_VERSION)
    .addBearerAuth()
    .build();
  const backOfficeDocument = SwaggerModule.createDocument(
    app,
    configBackOffice,
  );
  SwaggerModule.setup('api/docs', app, backOfficeDocument);

  // Initialise les services de cycle de vie de l'application
  new LifecycleService(app);

  // Active les hooks de shutdown pour gérer la fermeture de l'application
  app.enableShutdownHooks();

  // Lance l'application en écoutant sur le port défini dans les variables d'environnement
  await app.listen(process.env.APP_PORT, '0.0.0.0');
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}

// Appelle la fonction bootstrap pour démarrer l'application
bootstrap();
