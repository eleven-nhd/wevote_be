import { Controller, Get, Param, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('/get-total-votes')
  getTotalVotes(@Req() req: any) {
    return this.dashboardService.getTotalVote(req);
  }
  @Get('/get-total-campaigns')
  getTotalCampaigns(@Req() req: any) {
    return this.dashboardService.getTotalCampaign(req);
  }
  @Get('/get-total-transactions')
  getTotalTransactions(@Req() req: any) {
    return this.dashboardService.getTotalTransactions(req);
  }
}