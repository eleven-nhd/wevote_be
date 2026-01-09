import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly description?: string | null;
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly featureImage?: string | null;
  @ApiProperty()
  readonly publicResult: boolean;
  @ApiProperty()
  readonly startTime: Date;
  @ApiProperty()
  readonly endTime: Date;
}
