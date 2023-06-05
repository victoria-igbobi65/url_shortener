import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsEmail()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  readonly email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly password: string;
}
