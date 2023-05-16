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

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private UrlModel: Model<Url>) {}

  async create(url: CreateUrlDto): Promise<{ data: Url }> {
    const existingUrl = await this.getmappingByLongURl(url.longUrl);

    /*Checks if longUrl has been shortened before*/
    if (existingUrl) throw new HttpException(E_LONG_URL_EXISTS, 409);

    /*Generate unique id for new long url*/
    const uniqueId = nanoid();
    const shortenedUrl = `${CONFIG.BASE_URL}/${uniqueId}`;

    /*save the long url with its new short url to the db*/
    const data = await this.UrlModel.create({
      longUrl: url.longUrl,
      shortUrl: shortenedUrl,
      shortId: uniqueId,
    });

    return { data };
  }

  findAll() {
    return `This action returns all url`;
  }

  async getLongUrl(shortId: string) {
    const data = await this.UrlModel.findOne({ shortId }).exec();
    if (!data) throw new HttpException(E_LONG_URL_NOT_EXISTS, 404);

    /*Update Url count*/
    data.count++;
    console.log(data);
    return await data.save();
  }

  update(id: number) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
  async getmappingByLongURl(longUrl: string) {
    return this.UrlModel.findOne({ longUrl }).exec();
  }
}
