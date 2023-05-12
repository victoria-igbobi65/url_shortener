import { NestFactory } from '@nestjs/core';
import { rateLimit } from 'express-rate-limit';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import CONFIG from './common/config/config';
import { E_TOO_MANY_REQUEST } from './common/error/exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(
    rateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false,
      message: { message: E_TOO_MANY_REQUEST, statusCode: 403 },
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalGuards();
  await app.listen(CONFIG.PORT);
}
bootstrap();
