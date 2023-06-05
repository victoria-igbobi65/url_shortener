import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
