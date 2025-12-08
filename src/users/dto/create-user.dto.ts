import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsString()
  roleId: string;

  @ApiProperty()
  @IsString()
  password: string;
}
