import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { VotesModule } from '../votes/votes.module';
import { CampaignRepository } from './campaigns.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    VotesModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignRepository],
})
export class CampaignsModule {}
