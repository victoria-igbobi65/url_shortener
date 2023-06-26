import { IsDefined, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsUrl()
  longUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsDefined()
  @IsString()
  name: string;
}
