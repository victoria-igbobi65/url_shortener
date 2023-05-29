import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './models/url.model';
import { RequestInfo } from './models/request-info.model';
import { CreateUrlDto } from './dto/create-url.dto';

describe('UrlService', () => {
  let urlService: UrlService;
  let urlModel: any;
  let requestModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: getModelToken(Url.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(RequestInfo.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    urlService = module.get<UrlService>(UrlService);
    urlModel = module.get(getModelToken(Url.name));
    requestModel = module.get(getModelToken(RequestInfo.name));
  });

  /* unit test for the CREATE function */
  describe('create', () => {
    it('should create a new URL', async () => {
      const url: CreateUrlDto = {
        longUrl: 'http://example.com',
      };
      const userId = 'user-id';

      const existingUrl = null;
      const createdUrl = {
        longUrl: 'http://example.com',
        shortUrl: 'http://shorturl.com/abc123',
        shortId: 'abc123',
        ownerId: 'user-id',
      };

      jest
        .spyOn(urlService, 'getmappingByLongURl')
        .mockResolvedValue(existingUrl);
      jest.spyOn(urlModel, 'create').mockResolvedValue(createdUrl);

      const result = await urlService.create(url, userId);

      expect(urlService.getmappingByLongURl).toHaveBeenCalledWith(
        url.longUrl,
        userId,
      );
      expect(urlModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ longUrl: url.longUrl, ownerId: userId }),
      );
      expect(result).toEqual({ data: createdUrl });
    });
  });

  /*Unit test for the FINDALL function*/
  describe('findall', () => {
    it("should find all url's for a user", async () => {
      const urls = [
        {
          longUrl: 'http://example.com',
          shortUrl: 'http://shorturl.com/abc123',
          shortId: 'abc123',
          ownerId: 'user-id',
        },
      ];
      jest
        .spyOn(urlModel, 'find')
        .mockReturnValue({ exec: jest.fn().mockResolvedValue(urls) });
    });
  });

  /*Unit test for the FINDONE function*/
  describe('findone', () => {
    it('should find and return a URL by ID and user ID', async () => {
      const userId = 'user-id';
      const urlId = 'url-id';
      const urlData = { _id: urlId, ownerId: userId } as unknown as Url;
      const requestInfo = [];

      jest.spyOn(urlModel, 'findOne').mockResolvedValue(urlData);
      jest.spyOn(requestModel, 'find').mockReturnThis();
      jest.spyOn(requestModel, 'exec').mockResolvedValue(requestInfo);

      const result = await urlService.findone(urlId, userId);

      expect(urlModel.findOne).toHaveBeenCalledWith({
        _id: urlId,
        ownerId: userId,
      });
      expect(requestModel.find).toHaveBeenCalledWith({ url_id: urlId });
      expect(requestModel.exec).toHaveBeenCalled();
      expect(result).toEqual({
        data: urlData,
        count: requestInfo.length,
        reqInfo: requestInfo,
      });
    });

    it('should throw an error if URL not found', async () => {
      const userId = 'user-id';
      const urlId = 'url-id';

      jest.spyOn(urlModel, 'findOne').mockResolvedValue(null);

      await expect(urlService.findone(urlId, userId)).rejects.toThrowError(
        HttpException,
      );
    });
  });

  /*Unit test for the GETLONGURL function*/
  describe('getLongUrl', () => {
    it('should throw an error if URL not found', async () => {
      const shortId = 'short-id';

      jest.spyOn(urlModel, 'findOne').mockReturnThis();
      jest.spyOn(urlModel, 'exec').mockResolvedValue(null);

      await expect(
        urlService.getLongUrl(shortId, 'ip', 'agent'),
      ).rejects.toThrowError(HttpException);
    });

    it('should find and return a URL by short ID', async () => {
      const shortId = 'short-id';
      const urlData = {
        _id: 'url-id',
        shortId: 'short-id',
        longUrl: 'http://example.com',
        count: 0,
        save: jest.fn(),
      };

      jest.spyOn(urlModel, 'findOne').mockReturnThis();
      jest.spyOn(urlModel, 'exec').mockResolvedValue(urlData);
      jest.spyOn(urlData, 'save').mockResolvedValue(urlData);
      jest.spyOn(requestModel, 'create').mockResolvedValue(null);

      const result = await urlService.getLongUrl(shortId, 'ip', 'agent');

      expect(result).toEqual(urlData);
      expect(urlData.count).toBe(1);
      expect(urlModel.findOne).toHaveBeenCalledWith({ shortId });
      expect(urlModel.exec).toHaveBeenCalled();
      expect(requestModel.create).toHaveBeenCalledWith({
        ip: 'ip',
        agent: 'agent',
        url_id: urlData._id,
      });
    });
  });

  /*Unit test for the GETMAPPINGBYLONGURL function*/
  describe('getmappingByLongURl', () => {
    it('should return the URL when it exists', async () => {
      const longUrl = 'http://example.com';
      const userId = 'user-id';
      const existingUrl = { longUrl, ownerId: userId };

      jest.spyOn(urlModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(existingUrl),
      });

      const result = await urlService.getmappingByLongURl(longUrl, userId);

      expect(urlModel.findOne).toHaveBeenCalledWith({
        longUrl,
        ownerId: userId,
      });
      expect(result).toEqual(existingUrl);
    });

    it('should return null when the URL does not exist', async () => {
      const longUrl = 'http://example.com';
      const userId = 'user-id';

      jest.spyOn(urlModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await urlService.getmappingByLongURl(longUrl, userId);

      expect(urlModel.findOne).toHaveBeenCalledWith({
        longUrl,
        ownerId: userId,
      });
      expect(result).toBeNull();
    });
  });
});
