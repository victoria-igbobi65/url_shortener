import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { E_EMAIL_EXISTS } from 'src/common/constants.text';
import { LoginDto } from './dto/login.dto';

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
    const userExists = await this.authModel.findOne({ email: dto.email });
    if (userExists) throw new HttpException(E_EMAIL_EXISTS, 409);

    const data = await this.authModel.create(dto);
    data.password = undefined; /* Delete password from return body */

    return { data };
  }

  async login(dto: LoginDto) {
    return dto;
  }
}
