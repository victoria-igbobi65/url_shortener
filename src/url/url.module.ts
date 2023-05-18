import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { Url, shortUrlSchema } from './models/url.model';
import { RequestInfo, RequestInfoschema } from './models/request-info.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Url.name, schema: shortUrlSchema },
      { name: RequestInfo.name, schema: RequestInfoschema },
    ]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
