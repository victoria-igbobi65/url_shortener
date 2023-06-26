import { HttpException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as nanoid from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUrlDto } from './dto/create-url.dto';
import CONFIG from '../common/config/config';
import { Url } from './models/url.model';
import { E_LONG_URL_NOT_EXISTS } from '../common/constants.text';
import { RequestInfo } from './models/request-info.model';
import {
  Connection,
  CreateUrlInterface,
  UrlAllInterface,
} from './interface/response';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name) private UrlModel: Model<Url>,
    @InjectModel(RequestInfo.name) private RequestModel: Model<RequestInfo>,
  ) {}

  async create(url: CreateUrlDto, userId: string): Promise<CreateUrlInterface> {
    let data = await this.getmappingByLongURl(url.longUrl, userId); // This works for when a url has been shortend and the qrcodce is to be fetched instead of creating a new documents it fetches the ducument if it exists and returns it.

    if (data) return { data }; // returns the document if it exists else create a new one
    const uniqueId = nanoid(5); /*Generate unique id for new long url*/
    const shortenedUrl = `${CONFIG.BASE_URL}/${uniqueId}`;

    /*save the long url with its new short url to the db*/
    data = await this.UrlModel.create({
      longUrl: url.longUrl,
      shortUrl: shortenedUrl,
      shortId: uniqueId,
      ownerId: userId,
    });
    return { data };
  }

  async findAll(userId: string): Promise<UrlAllInterface> {
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
    if (!data) throw new HttpException(E_LONG_URL_NOT_EXISTS, 404);

    const urlRequestInfo = await this.RequestModel.find({ url_id: id }).exec();
    return { data, count: urlRequestInfo.length, reqInfo: urlRequestInfo };
  }

  async deleteShortenedUrl(id: string, userId: string) {
    const data = await this.UrlModel.findOne({ _id: id, ownerId: userId });
    if (!data) throw new HttpException(E_LONG_URL_NOT_EXISTS, 404);
    return await this.UrlModel.findOneAndDelete({ _id: id, ownerId: userId });
  }

  async getmappingByLongURl(longUrl: string, userId: string) {
    return this.UrlModel.findOne({ longUrl, ownerId: userId }).exec();
  }
}
