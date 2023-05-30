import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';
import 'dotenv/config';

import { User } from 'src/auth/models/user.model';
import { Url } from 'src/url/models/url.model';
import { AppModule } from '../src/app.module';
import {
  H_FAKE_SHORTURL,
  H_LOGINDTO,
  H_SIGNUPDTO,
  H_URLS,
} from './test-helper';
import { E_LONG_URL_NOT_EXISTS } from '../src/common/constants.text';

describe('UrlController (e2e)', () => {
  let app: INestApplication;
  let urlModel: Model<Url>;
  let authModel: Model<User>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    urlModel = moduleFixture.get<Model<Url>>('UrlModel');
    authModel = moduleFixture.get<Model<User>>('UserModel');
    await app.init();
  });

  beforeEach(async () => {
    await urlModel.deleteMany({});
    await authModel.deleteMany({});

    /*signup and login for user 1*/
    await request(app.getHttpServer()).post('/auth/signup').send(H_SIGNUPDTO);
    const login = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(H_LOGINDTO);
    authToken = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/:shortid (GET)', () => {
    it('should redirect a user when they provide a valid short url', async () => {
      const response = await request(app.getHttpServer())
        .post('/url/')
        .send(H_URLS[0])
        .set('Authorization', `Bearer ${authToken}`);

      const shorturl = response.body.data.shortUrl;
      const redirect = await request(app.getHttpServer())
        .get(shorturl)
        .expect(HttpStatus.MOVED_PERMANENTLY);
      expect(redirect.headers.location).toBe(H_URLS[0]);
    });

    it('should return a 404 error when shortid is not valid', async () => {
      const redirect = await request(app.getHttpServer())
        .get(H_FAKE_SHORTURL)
        .expect(HttpStatus.NOT_FOUND);
      expect(redirect.body).toEqual({ message: E_LONG_URL_NOT_EXISTS });
    });
  });
});
