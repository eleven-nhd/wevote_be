import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  voterId: string;
  @ApiProperty()
  @IsNumber()
  choose: number;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  voteId: Types.ObjectId;
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  campaignId: Types.ObjectId;
  @ApiProperty()
  creationTime?: Date;
}
