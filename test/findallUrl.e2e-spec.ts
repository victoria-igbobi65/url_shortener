import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';

import { User } from '../src/auth/models/user.model';
import { Url } from '../src/url/models/url.model';
import { AppModule } from '../src/app.module';
import {
  H_LOGINDTO,
  H_USER2,
  H_SIGNUPDTO,
  H_USER2_SIGN,
  H_URLS,
} from './test-helper';

describe('UrlController (e2e)', () => {
  let app: INestApplication;
  let urlModel: Model<Url>;
  let authModel: Model<User>;
  let authToken1: string;
  let authToken2: string;

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
    authToken1 = login.body.token;

    /*signup and login for user 2*/
    await request(app.getHttpServer()).post('/auth/signup').send(H_USER2_SIGN);

    const loginRes = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(H_USER2);
    authToken2 = loginRes.body.token;
  });

  afterAll(async () => {
    await app.close();
  });
  describe('/url/ (GET)', () => {
    it('should fetch all url shortened by a user1', async () => {
      /*URL 1*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken1}`)
        .send(H_URLS[0]);

      /*URL 2*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken1}`)
        .send(H_URLS[1]);

      /*URL 3*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken1}`)
        .send(H_URLS[5]);
      const response = await request(app.getHttpServer())
        .get('/url')
        .set('Authorization', `Bearer ${authToken1}`)
        .expect(HttpStatus.OK);
      expect(response.body.count).toBe(3);
      expect(response.body).toHaveProperty('data');
    });
    it('should fetch all url shortened by a user2', async () => {
      /*URL 1*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken2}`)
        .send(H_URLS[2]);

      /*URL 2*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken2}`)
        .send(H_URLS[3]);

      /*URL 3*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken2}`)
        .send(H_URLS[4]);

      /*URL 3*/
      await request(app.getHttpServer())
        .post('/url')
        .set('Authorization', `Bearer ${authToken2}`)
        .send(H_URLS[5]);

      const response = await request(app.getHttpServer())
        .get('/url')
        .set('Authorization', `Bearer ${authToken2}`)
        .expect(HttpStatus.OK);
      expect(response.body.count).toBe(4);
      expect(response.body).toHaveProperty('data');
    });
  });
});
