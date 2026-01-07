import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../transactions/schema/transaction.schema';
import { Model, Types } from 'mongoose';
import { Campaign } from '../campaigns/schema/campaign.schema';
import { Vote } from '../votes/schema/vote.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<Campaign>,
    @InjectModel(Vote.name)
    private readonly voteModel: Model<Vote>
  ) {}

  async getTotalVote(req: any): Promise<number> {
    const data = await this.voteModel
      .find({
        creatorId: req.userId || null
      })
      .exec();
    return data.length;
  }

  async getTotalCampaign(req: any): Promise<number> {
    const data = await this.campaignModel
      .find({
        creatorId: req.userId || null
      })
      .exec();
    return data.length;
  }

  async getTotalTransactions(req: any) {
    const data = await this.transactionModel.aggregate([
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      {
        $unwind: '$campaign',
      },
      {
        $match: {
          'campaign.creatorId': new Types.ObjectId(req.userId),
        },
      },
      {
        $project: {
          campaign: 0,
        },
      },
    ]);
    return data.length;
  }


}
