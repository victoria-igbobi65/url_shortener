import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as qrcode from 'qrcode';

import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetLinkDto } from './dto/get-link-info.dto';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { User } from 'src/auth/models/user.model';

@UseGuards(AuthGuard('jwt'))
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto, @CurrentUser() user: User) {
    return this.urlService.create(createUrlDto, user._id);
  }

  @Post('qrcode')
  async createQr(
    @Body() dto: CreateUrlDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const url = (await this.urlService.create(dto, user._id)).data.shortUrl;
    const data = await qrcode.toDataURL(url);
    res.json({ data });
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.urlService.findAll(user._id);
  }

  @Get(':id')
  async GetUrlInfo(@Param() { id }: GetLinkDto, @CurrentUser() user: User) {
    return this.urlService.findone(id, user._id);
  }
}
