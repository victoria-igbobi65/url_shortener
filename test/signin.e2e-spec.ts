import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Model } from 'mongoose';

import { User } from 'src/auth/models/user.model';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/auth/dto/create-user.dto';
import { E_EMAIL_EXISTS } from '../src/common/constants.text';

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

  describe('/auth/signup (POST)', () => {
    it('should register a new user', async () => {
      const userDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDto)
        .expect(HttpStatus.CREATED);

      expect(response.body.data.name).toBe(userDto.name);
      expect(response.body.data.email).toBe(userDto.email);
      expect(response.body.data.password).toBeUndefined();
    });

    it('should throw an error when email already exists', async () => {
      const existingUser: CreateUserDto = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password',
      };

      // Create an existing user
      await authModel.create(existingUser);

      const userDto: CreateUserDto = {
        name: 'John Doe',
        email: 'jane@example.com', // Use existing email
        password: 'password',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDto)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(E_EMAIL_EXISTS);
    });
  });
});
