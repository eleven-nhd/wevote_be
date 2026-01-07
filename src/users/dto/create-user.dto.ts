import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  roleId: Types.ObjectId;

  @ApiProperty()
  @IsString()
  password: string;
}
