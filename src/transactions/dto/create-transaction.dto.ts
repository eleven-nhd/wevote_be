import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  voterId: string;
  @ApiProperty()
  @IsNumber()
  choose: number;
  @ApiProperty()
  @IsString()
  voteId: string;
}
