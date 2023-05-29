import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

import {
  E_EMAIL_EXISTS,
  E_INCORRECT_CREDENTIALS,
} from '../common/constants.text';
import { AuthService } from './auth.service';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let authModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authModel = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  /*Unit tests for the REGISTER function*/
  describe('Register', () => {
    it('should register a new user when email does not exist', async () => {
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(authModel, 'create').mockResolvedValue(createUserDto as any);

      const result = await authService.register(createUserDto);

      expect(authService.findOneByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(authModel.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({ data: createUserDto });
    });
    it('should throw an error when email already exists', async () => {
      const existingUser: any = {
        name: 'existing',
        email: 'existing@example.com',
        password: 'password',
      };
      const createUserDto: CreateUserDto = {
        name: 'test',
        email: 'existing@example.com',
        password: 'password',
      };

      jest.spyOn(authService, 'findOneByEmail').mockResolvedValue(existingUser);

      await expect(authService.register(createUserDto)).rejects.toThrowError(
        E_EMAIL_EXISTS,
      );
      expect(authService.findOneByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });
  });

  /*Unit test for the LOGIN function*/
  describe('Login', () => {
    it('should log in the user and return user data with a token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user: any = {
        _id: 'user_id',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(user),
        validatePassword: jest.fn().mockResolvedValue(true),
      } as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await authService.login(loginDto);

      expect(authModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
      expect(user.validatePassword).toHaveBeenCalledWith(loginDto.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user._id,
        email: user.email,
      });
      expect(result).toEqual({ data: user, token: 'jwt_token' });
    });

    it('should throw an error for incorrect credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(authModel, 'findOne').mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(authService.login(loginDto)).rejects.toThrowError(
        new HttpException(E_INCORRECT_CREDENTIALS, 400),
      );

      expect(authModel.findOne).toHaveBeenCalledWith({ email: loginDto.email });
    });
  });

  /*Unit tests for the FINDONEBYEMAIL function*/
  describe('findOneByEmail', () => {
    it('should find a user by email', async () => {
      const userEmail = 'test@example.com';
      const userMock = {
        _id: 'user_id',
        name: 'test',
        email: userEmail,
        password: 'password',
      };

      jest.spyOn(authModel, 'findOne').mockResolvedValue(userMock as any);

      const result = await authService.findOneByEmail(userEmail);

      expect(authModel.findOne).toHaveBeenCalledWith({ email: userEmail });
      expect(result).toEqual(userMock);
    });

    it('should return null when user does not exist', async () => {
      const userEmail = 'test@example.com';

      jest.spyOn(authModel, 'findOne').mockResolvedValue(null);

      const result = await authService.findOneByEmail(userEmail);

      expect(authModel.findOne).toHaveBeenCalledWith({ email: userEmail });
      expect(result).toBeNull();
    });
  });

  /*Unit test for the SIGNTOKEN function*/
  describe('signToken', () => {
    it('should sign a token with user data', async () => {
      const userMock = {
        _id: 'user_id',
        name: 'test',
        email: 'test@example.com',
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt_token');

      const result = await authService.signToken(userMock as any);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: userMock._id,
        email: userMock.email,
      });
      expect(result).toBe('jwt_token');
    });
  });
});
