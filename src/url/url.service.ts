import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as nanoid from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';

import { CreateUrlDto } from './dto/create-url.dto';
import { Url } from './models/url.model';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private UrlModel: Model<Url>) {}
  async create(url: CreateUrlDto) {
    const existingUrl = await this.getmappingsByLongURl(url.longUrl);

    if (existingUrl) {
      console.log(existingUrl);
      return existingUrl.shortId;
    }
    /*Generate unique id for new long url*/
    const uniqueId = nanoid();
    console.log(url, uniqueId);
  }

  findAll() {
    return `This action returns all url`;
  }

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
  async getmappingsByLongURl(longUrl: string) {
    return this.UrlModel.findOne({ longUrl }).exec();
  }
}
