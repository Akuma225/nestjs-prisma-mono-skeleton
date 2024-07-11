import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { LifecycleService } from './commons/lifecycles/LifecycleService';
import { PrismaClientExceptionFilter } from './commons/filters/prisma-client-exception/prisma-client-exception.filter';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const APP_NAME = process.env.APP_NAME;
  const BACK_OFFICE_DESCRIPTION = process.env.BACK_OFFICE_DESCRIPTION;
  const APP_VERSION = process.env.APP_VERSION;

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.use(bodyParser.json());

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, captcha-key, Wave-Signature'
    ],
    credentials: true,
  });
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });

  const configBackOffice = new DocumentBuilder()
    .setTitle(APP_NAME)
    .setDescription(BACK_OFFICE_DESCRIPTION)
    .setVersion(APP_VERSION)
    .build();
  const backOfficeDocument = SwaggerModule.createDocument(
    app,
    configBackOffice,
  );
  SwaggerModule.setup('api/docs', app, backOfficeDocument);
  new LifecycleService(app);
  app.enableShutdownHooks();

  await app.listen(process.env.APP_PORT, '0.0.0.0');
  Logger.log(`Application is running on: ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
