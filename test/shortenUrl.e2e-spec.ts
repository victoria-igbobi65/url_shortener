import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';

import { User } from '../src/auth/models/user.model';
import { Url } from '../src/url/models/url.model';
import { AppModule } from '../src/app.module';
import { H_LOGINDTO, H_URLS, H_SIGNUPDTO } from './test-helper';

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

    await request(app.getHttpServer()).post('/auth/signup').send(H_SIGNUPDTO);

    const login = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(H_LOGINDTO);
    authToken = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should access authenticated endpoint successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${authToken}`)
      .send(H_URLS[0])
      .expect(HttpStatus.CREATED);
    expect(response.body.data).toHaveProperty('longUrl');
    expect(response.body.data).toHaveProperty('shortUrl');
    expect(response.body.data).toHaveProperty('shortId');
    expect(response.body.data).toHaveProperty('ownerId');
    expect(response.body.data).toHaveProperty('_id');
  });

  it("should return a 401 error if user isn't authorized", async () => {
    await request(app.getHttpServer())
      .post('/url')
      .send(H_URLS[0])
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('should return a 409 error code when a URL has already been shortened', async () => {
    await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${authToken}`)
      .send(H_URLS[0]);

    const response = await request(app.getHttpServer())
      .post('/url')
      .set('Authorization', `Bearer ${authToken}`)
      .send(H_URLS[0])
      .expect(HttpStatus.CONFLICT);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Long url already exists');
  });
});
