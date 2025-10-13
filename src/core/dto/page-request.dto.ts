import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PageRequestDto {
  @ApiProperty()
  @IsString()
  readonly keyword: string;
  @ApiProperty()
  readonly page: number;
  @ApiProperty()
  readonly size: number;
}