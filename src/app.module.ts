import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager/dist';
//import * as redisStore from 'cache-manager-redis-store';

import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { RedirectModule } from './redirect/redirect.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(`${process.env.DB_URL}`, {
      dbName: process.env.DB_NAME,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    UrlModule,
    AuthModule,
    RedirectModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
