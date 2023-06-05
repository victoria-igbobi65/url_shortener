import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetLinkDto {
  @ApiProperty()
  @IsMongoId()
  id: string;
}
