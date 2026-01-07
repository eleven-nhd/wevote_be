import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { VotesModule } from '../votes/votes.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TransactionsModule,
    CampaignsModule,
    VotesModule
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}