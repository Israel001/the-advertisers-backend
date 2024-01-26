/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { corsConfiguration } from './config/cors-configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as eavSeeder from './seeders/main';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BasePaginatedResponseDto } from './base/dto';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfiguration,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableShutdownHooks();

  const options = new DocumentBuilder()
    .setTitle('The Advertisers')
    .setDescription('API documentation for the advertisers')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    extraModels: [BasePaginatedResponseDto],
  });
  SwaggerModule.setup('api-docs/', app, document);

  await app.listen(process.env.PORT || 8080, () => {
    new Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
  });

  if (parseInt(process.env.RUN_SEEDER || '1')) {
    await eavSeeder.bootstrap(false);
  }
}
bootstrap();
