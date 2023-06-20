import { NestFactory } from '@nestjs/core';
import { rateLimit } from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'dotenv/config';

import { AppModule } from './app.module';
import CONFIG from './common/config/config';
import { E_TOO_MANY_REQUEST } from './common/constants.text';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Rate limiting pending
  // app.use(
  //   rateLimit({
  //     windowMs: 10 * 60 * 1000,
  //     max: 100,
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //     skipSuccessfulRequests: false,
  //     message: { message: E_TOO_MANY_REQUEST, statusCode: 403 },
  //   }),
  // );

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  /* Swagger Documentation */
  const config = new DocumentBuilder()
    .setTitle('URL Shortener')
    .setDescription('The URL shortener description')
    .setVersion('1.0')
    .addTag('Url')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(CONFIG.PORT);
}
bootstrap();
