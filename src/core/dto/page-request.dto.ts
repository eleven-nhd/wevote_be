import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PageRequestDto {
  @ApiProperty()
  readonly filters: any;
  @ApiProperty()
  readonly page: number;
  @ApiProperty()
  readonly size: number;
}