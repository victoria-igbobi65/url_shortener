import { ApiProperty } from '@nestjs/swagger';
import { RequestInfo } from '../models/request-info.model';
import { Url } from '../models/url.model';

export class Connection {
  @ApiProperty()
  data: Url;

  @ApiProperty()
  count: number;

  @ApiProperty()
  reqInfo: RequestInfo[];
}

export class CreateUrlInterface {
  @ApiProperty()
  data: Url;
}

export class QrUrlInterface {
  @ApiProperty()
  data: string;
}

export class UrlAllInterface {
  @ApiProperty()
  count: number;

  @ApiProperty()
  data: Url[];
}
