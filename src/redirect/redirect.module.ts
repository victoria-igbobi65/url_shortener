import { Module } from '@nestjs/common';

import { UrlModule } from 'src/url/url.module';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [UrlModule],
  controllers: [RedirectController],
})
export class RedirectModule {}
