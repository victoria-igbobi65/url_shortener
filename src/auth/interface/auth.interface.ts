import { ApiProperty } from '@nestjs/swagger';
import { User } from '../models/user.model';

export class AuthResponse {
  @ApiProperty()
  data: User;

  @ApiProperty()
  token: string;
}
