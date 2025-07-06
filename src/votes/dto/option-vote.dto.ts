import { IsNumber, IsString } from 'class-validator';

export class OptionVoteDto {
  @IsNumber()
  readonly point: number;
  @IsString()
  readonly option: string;
}
