import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Model } from 'mongoose';

import { Url } from 'src/url/models/url.model';
import { AuthService } from '../src/auth/auth.service';
import { AppModule } from '../src/app.module';

describe('UrlController (e2e)', () => {
  let app: INestApplication;
  let urlModel: Model<Url>;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    urlModel = moduleFixture.get<Model<Url>>('UserModel');
    await app.init();

    // Mock the authentication process and generate a JWT token
    const authService = moduleFixture.get(AuthService);
    jest
      .spyOn(authService, 'login')
      .mockResolvedValue({ data: null, token: 'mocked_token' }); // Mock user validation
    const user = { id: 'mockUserId', email: 'test@example.com', name: 'test' }; // Mock user object
    authToken = await authService.signToken(user as any); // Generate JWT token
    console.log(authToken);
  });

  beforeEach(async () => {
    await urlModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  // it('should access authenticated endpoint successfully', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/url')
  //     .set('Authorization', `Bearer ${authToken}`)
  //     .expect(HttpStatus.OK);

  //   // Assert the expected response or behavior
  //   expect(response.body).toHaveProperty('data');
  //   // ...
  // });

  it("should return a 401 error if user isn't authorized", async () => {
    const createUrlDto = { originalUrl: 'https://example.com' };

    await request(app.getHttpServer())
      .post('/url')
      .send(createUrlDto)
      .expect(HttpStatus.UNAUTHORIZED);
  });
});
