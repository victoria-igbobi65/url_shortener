import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';

import { User } from 'src/auth/models/user.model';
import { AppModule } from '../src/app.module';
import { E_INCORRECT_CREDENTIALS } from '../src/common/constants.text';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authModel: Model<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    authModel = moduleFixture.get<Model<User>>('UserModel');
    await app.init();
  });

  beforeEach(async () => {
    // Remove all documents from the collection
    await authModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signin (POST)', () => {
    it('should sign in the user and return a token', async () => {
      // Create a test user in the database
      await request(app.getHttpServer()).post('/auth/signup').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      });

      // Make a POST request to /auth/signin
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'password',
        })
        .expect(HttpStatus.OK);

      // Assert the response
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
    });

    it('should throw a 400 error for incorrect credentials', async () => {
      // Make a POST request to /auth/signin with incorrect credentials
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(HttpStatus.BAD_REQUEST);

      // Assert the response
      expect(response.body).toHaveProperty('message', E_INCORRECT_CREDENTIALS);
    });
    it('should throw a 400 error when user does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(HttpStatus.BAD_REQUEST);

      // Assert the response
      expect(response.body).toHaveProperty('message', E_INCORRECT_CREDENTIALS);
    });
  });
});
