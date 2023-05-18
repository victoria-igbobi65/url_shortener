import { Module } from '@nestjs/common';

import { UrlController } from 'src/url/url.controller';
import { UrlModule } from 'src/url/url.module';

@Module({
  imports: [UrlModule],
  controllers: [UrlController],
})
export class RedirectModule {}
