import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './models/user.model';
import {
  E_EMAIL_EXISTS,
  E_INCORRECT_CREDENTIALS,
} from 'src/common/constants.text';
import { AuthResponse } from './interface/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ type: User })
  @ApiConflictResponse({ description: E_EMAIL_EXISTS })
  signUp(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('signin')
  @ApiOkResponse({ type: AuthResponse })
  @ApiBadRequestResponse({ description: E_INCORRECT_CREDENTIALS })
  @HttpCode(200)
  signIn(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
