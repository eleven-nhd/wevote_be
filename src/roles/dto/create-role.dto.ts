import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  readonly description?: string;
}
