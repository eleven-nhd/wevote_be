import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { OptionVoteDto } from './option-vote.dto';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class CreateVoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  @IsString()
  readonly description: string;
  @ApiProperty()
  @IsString()
  readonly featureImage: string;
  @ApiProperty()
  @IsNotEmpty()
  readonly options: OptionVoteDto[];
  @ApiProperty()
  readonly renderType: number;
  @ApiProperty()
  readonly tags: string[];
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  readonly campaignId: Types.ObjectId;
  @ApiProperty()
  readonly createdDate: Date;
}
