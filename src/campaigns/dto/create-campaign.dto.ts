import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
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
  readonly publicResult: boolean;
  @ApiProperty()
  readonly startTime: Date;
  @ApiProperty()
  readonly endTime: Date;
  @ApiProperty()
  @IsString()
  readonly userId: string;
}
