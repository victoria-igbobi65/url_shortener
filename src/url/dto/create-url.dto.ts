import { IsDefined, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsUrl()
  longUrl: string;
}
