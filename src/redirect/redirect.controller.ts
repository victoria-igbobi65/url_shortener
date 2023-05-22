import { Controller, Param, Res, Req, Get } from '@nestjs/common';
import { Request, Response } from 'express';
import { UrlService } from 'src/url/url.service';

@Controller()
export class RedirectController {
  constructor(private readonly urlService: UrlService) {}

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
}
