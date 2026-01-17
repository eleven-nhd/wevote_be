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
          'campaign.creatorId': req.userId,
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

  async getTopVoteList(req: any) {
    const pipeline: any[] = [
      {
        $match: req.userId
          ? { creatorId: req.userId }
          : {},
      },
      {
        $lookup: {
          from: 'transactions',
          let: { voteId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$voteId', '$$voteId'] },
              },
            },
            {
              $group: {
                _id: null,
                totalTransaction: { $sum: 1 },
                totalChoose: { $sum: '$choose' },
              },
            },
          ],
          as: 'transactionStats',
        },
      },
      {
        $addFields: {
          totalTransaction: {
            $ifNull: [{ $arrayElemAt: ['$transactionStats.totalTransaction', 0] }, 0],
          },
          totalChoose: {
            $ifNull: [{ $arrayElemAt: ['$transactionStats.totalChoose', 0] }, 0],
          },
        },
      },
      {
        $project: {
          transactionStats: 0,
        },
      },
    ];

    return this.voteModel.aggregate(pipeline);
  }

  async getCampaignPieChart(req: any) {
    const now = new Date();
    const match: any = req.userId ? { creatorId: req.userId } : {};

    const pipeline: any[] = [
      { $match: match },
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                {
                  case: {
                    $and: [
                      { $lte: ['$startTime', now] },
                      { $gte: ['$endTime', now] },
                    ],
                  },
                  then: 'Đang diễn ra',
                },
                {
                  case: { $gt: ['$startTime', now] },
                  then: 'Sắp diễn ra',
                },
                {
                  case: { $lt: ['$endTime', now] },
                  then: 'Đã kết thúc',
                },
              ],
              default: 'Đang diễn ra',
            },
          },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ];

    const agg: { _id: string; count: number }[] = await this.campaignModel.aggregate(pipeline);

    const result = {
      ongoing: 0,
      upcoming: 0,
      ended: 0,
    };

    agg.forEach((r) => {
      if (r._id === 'Đang diễn ra') result.ongoing = r.count;
      else if (r._id === 'Sắp diễn ra') result.upcoming = r.count;
      else if (r._id === 'Đã kết thúc') result.ended = r.count;
    });

    return [
      { name: 'Đang diễn ra', value: result.ongoing },
      { name: 'Sắp diễn ra', value: result.upcoming },
      { name: 'Đã kết thúc', value: result.ended },
    ];
  }

  async getTopCampaignByTransactions(req: any) {
    const match: any = req.userId ? { creatorCampaignId: new Types.ObjectId(req.userId) } : {};

    const pipeline: any[] = [
      { $match: match },
      {
        $group: {
          _id: '$campaignId',
          totalTransactions: { $sum: 1 },
        },
      },
      { $sort: { totalTransactions: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'campaigns',
          localField: '_id',
          foreignField: '_id',
          as: 'campaign',
        },
      },
      { $unwind: { path: '$campaign', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          campaign: '$campaign',
          totalTransactions: 1,
        },
      },
    ];

    const res = await this.transactionModel.aggregate(pipeline);

    if (!res || res.length === 0) {
      return null;
    }

    return res[0];
  }

  async getTopVoteByTransactions(req: any) {
    const pipeline: any[] = [
      {
        $group: {
          _id: '$voteId',
          totalTransactions: { $sum: 1 },
          totalChoose: { $sum: { $ifNull: ['$choose', 0] } },
        },
      },
      {
        $lookup: {
          from: 'votes',
          localField: '_id',
          foreignField: '_id',
          as: 'vote',
        },
      },
      { $unwind: { path: '$vote', preserveNullAndEmptyArrays: true } },
      ...(req && req.userId
        ? [{ $match: { $or: [{ 'vote.creator': req.userId }, { 'vote.creatorId': req.userId }] } }]
        : []),
      { $sort: { totalTransactions: -1 } },
      { $limit: 1 },
      {
        $project: {
          _id: 0,
          vote: '$vote',
          totalTransactions: 1,
          totalChoose: 1,
        },
      },
    ];

    const res = await this.transactionModel.aggregate(pipeline as any);

    if (!res || res.length === 0) return null;

    return res[0];
  }

}
