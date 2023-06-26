import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetLinkDto } from './dto/get-link-info.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { User } from '../auth/models/user.model';
import { E_LONG_URL_NOT_EXISTS } from 'src/common/constants.text';
import {
  CreateUrlInterface,
  QrUrlInterface,
  UrlAllInterface,
  Connection,
} from './interface/response';

@ApiTags('url')
@UseGuards(AuthGuard('jwt'))
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateUrlInterface })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async create(@Body() createUrlDto: CreateUrlDto, @CurrentUser() user: User) {
    return this.urlService.create(createUrlDto, user._id);
  }

  @Post('qrcode')
  @ApiOkResponse({ type: QrUrlInterface })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
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
  @ApiOkResponse({ type: UrlAllInterface })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll(@CurrentUser() user: User) {
    return this.urlService.findAll(user._id);
  }

  @Get(':id')
  @ApiOkResponse({ type: Connection })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: E_LONG_URL_NOT_EXISTS })
  async GetUrlInfo(@Param() { id }: GetLinkDto, @CurrentUser() user: User) {
    return this.urlService.findone(id, user._id);
  }

  @Delete(':id')
  @HttpCode(204)
  async DeleteUrl(@Param() { id }: GetLinkDto, @CurrentUser() user: User) {
    return this.urlService.deleteShortenedUrl(id, user._id);
  }
}
