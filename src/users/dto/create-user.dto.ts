import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  readonly createdDate: Date;

  @ApiProperty()
  readonly lastestDate: Date;

  @ApiProperty()
  @IsString()
  readonly roleId: string;
}
