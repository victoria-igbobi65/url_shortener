import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';

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

  @Get(':shortCode')
  async handleRedirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.getLongUrl(shortCode);
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
