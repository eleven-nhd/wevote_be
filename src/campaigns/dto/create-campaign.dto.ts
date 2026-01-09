import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly description?: string = "";
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly featureImage?: string = "";
  @ApiProperty()
  readonly publicResult: boolean;
  @ApiProperty()
  readonly startTime: Date;
  @ApiProperty()
  readonly endTime: Date;
}
