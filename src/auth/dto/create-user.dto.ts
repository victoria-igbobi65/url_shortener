import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  readonly email: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
