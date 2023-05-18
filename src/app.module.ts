import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { RedirectController } from './redirect/redirect.controller';
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
    UrlModule,
    AuthModule,
    RedirectModule,
  ],
  controllers: [RedirectController],
  providers: [],
})
export class AppModule {}
