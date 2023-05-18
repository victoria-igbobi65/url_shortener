import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as nanoid from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUrlDto } from './dto/create-url.dto';
import CONFIG from '../common/config/config';
import { Url } from './models/url.model';
import {
  E_LONG_URL_EXISTS,
  E_LONG_URL_NOT_EXISTS,
} from 'src/common/constants.text';
import { RequestInfo } from './models/request-info.model';
import { Connection } from './interface/response';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private UrlModel: Model<Url>,
    @InjectModel(RequestInfo.name) private RequestModel: Model<RequestInfo>,
  ) {}

  async create(url: CreateUrlDto, userId: string): Promise<{ data: Url }> {
    const existingUrl = await this.getmappingByLongURl(url.longUrl, userId);

    /*Checks if longUrl has been shortened before*/
    if (existingUrl) throw new HttpException(E_LONG_URL_EXISTS, 409);
    const uniqueId = nanoid(); /*Generate unique id for new long url*/
    const shortenedUrl = `${CONFIG.BASE_URL}/${uniqueId}`;

    /*save the long url with its new short url to the db*/
    const data = await this.UrlModel.create({
      longUrl: url.longUrl,
      shortUrl: shortenedUrl,
      shortId: uniqueId,
      ownerId: userId,
    });
    return { data };
  }

  async findAll(userId: string): Promise<{ data: Url[]; count: number }> {
    const data = await this.UrlModel.find({ ownerId: userId });
    return { count: data.length, data };
  }

  async getLongUrl(shortId: string, ip: string, agent: string) {
    const data = await this.UrlModel.findOne({ shortId }).exec();
    if (!data) throw new HttpException(E_LONG_URL_NOT_EXISTS, 404);

    data.count++; /*Update Url count*/

    /*Save request information*/
    await this.RequestModel.create({
      ip: ip,
      agent: agent,
      url_id: data._id,
    });
    return await data.save();
  }

  async findone(id: string, userId: string): Promise<Connection> {
    const data = await this.UrlModel.findOne({ _id: id, ownerId: userId });
    if (!data) {
      throw new HttpException(E_LONG_URL_NOT_EXISTS, 404);
    }
    const urlRequestInfo = await this.RequestModel.find({ url_id: id }).exec();
    return { data, count: urlRequestInfo.length, reqInfo: urlRequestInfo };
  }

  async getmappingByLongURl(longUrl: string, userId: string) {
    return this.UrlModel.findOne({ longUrl, ownerId: userId }).exec();
  }
}
