import { PageRequestDto } from '../../core/dto/page-request.dto';

export class PageRequestTransactionDto extends PageRequestDto {
  campaignId?: string;
  voteId?: string;
}