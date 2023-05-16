import { IsDefined, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsDefined()
  @IsString()
  @IsUrl()
  longUrl: string;
}
