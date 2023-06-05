import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import {
  E_EMAIL_EXISTS,
  E_INCORRECT_CREDENTIALS,
} from '../common/constants.text';
import { LoginDto } from './dto/login.dto';
import { AuthResponse } from './interface/auth.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signToken(dto: User) {
    return this.jwtService.sign({ sub: dto._id, email: dto.email });
  }

  async register(dto: CreateUserDto): Promise<{ data: User }> {
    const userExists = await this.findOneByEmail(dto.email);
    if (userExists) throw new HttpException(E_EMAIL_EXISTS, 409);

    const data = await this.authModel.create(dto);
    data.password = undefined; /* Delete password from return body */

    return { data };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const data = await this.authModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!data || !(await data?.validatePassword(dto.password))) {
      throw new HttpException(E_INCORRECT_CREDENTIALS, 400);
    }
    const token = await this.signToken(data); /* sign token */
    data.password = undefined; /*remove password from user object*/
    return { data, token };
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.authModel.findOne({ email: email });
  }
}
