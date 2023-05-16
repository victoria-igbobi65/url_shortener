import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { Url, shortUrlSchema } from './models/url.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Url.name, schema: shortUrlSchema }]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
