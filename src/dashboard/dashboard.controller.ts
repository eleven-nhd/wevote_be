import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller("dashboards")
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
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
  @Get('/get-campaign-pie')
  getCampaignPie(@Req() req: any) {
    return this.dashboardService.getCampaignPieChart(req);
  }
  @Get('/get-top-votes')
  getTopVoteList(@Req() req: any) {
    return this.dashboardService.getTopVoteList(req);
  }

  @Get('/get-top-campaign')
  getTopCampaign(@Req() req: any) {
    return this.dashboardService.getTopCampaignByTransactions(req);
  }

  @Get('/get-top-vote')
  getTopVote(@Req() req: any) {
    return this.dashboardService.getTopVoteByTransactions(req);
  }
}