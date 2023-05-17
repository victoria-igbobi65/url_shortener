import { RequestInfo } from '../models/request-info.model';
import { Url } from '../models/url.model';

export class Connection {
  data: Url;

  count: number;

  reqInfo: RequestInfo[];
}
