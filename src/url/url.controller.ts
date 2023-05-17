import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Request, Response } from 'express';
import { GetLinkDto } from './dto/get-link-info.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get(':id')
  async GetUrlInfo(@Param() { id }: GetLinkDto) {
    return this.urlService.findone(id);
  }

  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const ip = req.ip,
      agent = req.headers['user-agent'];

    const url = await this.urlService.getLongUrl(shortCode, ip, agent);
    return res.redirect(301, url.longUrl);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.urlService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(+id);
  }
}
