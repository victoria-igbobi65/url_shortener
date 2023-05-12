import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
