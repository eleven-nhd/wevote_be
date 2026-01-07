import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiProperty()
  readonly description?: string;
  @ApiProperty()
  readonly featureImage?: string;
  @ApiProperty()
  readonly publicResult: boolean;
  @ApiProperty()
  readonly startTime: Date;
  @ApiProperty()
  readonly endTime: Date;
}
