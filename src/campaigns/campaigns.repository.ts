import { Injectable } from '@nestjs/common';
import { BaseAuditRepository } from '../core/repository/base-audit.repository';
import { Campaign } from './schema/campaign.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CampaignRepository extends BaseAuditRepository<Campaign> {
  constructor(
    @InjectModel(Campaign.name)
    campaignModel: Model<Campaign>
  ) {
    super(campaignModel);
  }
}
