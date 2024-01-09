/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { corsConfiguration } from './config/cors-configuration';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as eavSeeder from './seeders/main';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfiguration,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 8080, () => {
    new Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
  });

  if (parseInt(process.env.RUN_SEEDER || '1')) {
    await eavSeeder.bootstrap(false);
  }
}
bootstrap();
