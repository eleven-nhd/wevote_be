import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
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
}