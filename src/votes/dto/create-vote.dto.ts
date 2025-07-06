import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { OptionVoteDto } from './option-vote.dto';

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
  readonly campaignId: string;
  @ApiProperty()
  readonly createdDate: Date;
}
