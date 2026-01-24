import {
  BadRequestException,
  Injectable,
  NotFoundException, Req, Request,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './schema/campaign.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { DataSelectDto } from '../core/dto/data-select.dto';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { Vote } from '../votes/schema/vote.schema';
import { CampaignRepository } from './campaigns.repository';
import { Transaction } from '../transactions/schema/transaction.schema';

@Injectable()
export class CampaignsService {
  constructor(
    private readonly campaignRepo: CampaignRepository,
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto, req: any): Promise<Campaign> {
    return this.campaignRepo.createOne(createCampaignDto, {
      userId: req.userId || null
    });
  }

  findAll(request: PageRequestDto, req: any) {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.filters?.keyword
      ? {
          name: {
            $regex: request.filters?.keyword,
            $options: 'i',
          },
        }
      : {};
    return this.campaignRepo.findAll(keyword, resPerPage, skip, {
      userId: req.userId || null
    });
  }

  async getDataSelect(req: any): Promise<DataSelectDto[]> {
    const campaign = this.campaignModel.find({creatorId: req.userId || null}).exec();
    return campaign.then((res) => {
      return res.map((campaign) => {
        return {
          label: campaign.name,
          value: campaign._id,
        };
      });
    });
  }

  async findOne(id: string): Promise<Campaign> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('Id Campaign bắt buộc nhập!');
    }
    const result = await this.campaignModel.findOne({ _id: id });
    if (!result) {
      throw new NotFoundException('Không tìm thấy Campaign');
    }
    return result;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto, req: any){
    return this.campaignRepo.updateOne(id, updateCampaignDto, {
      userId: req.userId || null
    });
  }

  async remove(id: string, req: any) {
    const checkTransactions = await this.transactionModel.findOne({campaignId: new Types.ObjectId(id)}).exec();
    if (checkTransactions) {
      throw new BadRequestException('Chiến dịch đã có lượt vote, không thể xóa!');
    }
    return this.campaignRepo.softDelete(id, {
      userId: req.userId || null
    });
  }

  async getListVoteByCampaignId(campaignId: string, req: any): Promise<Vote[]> {
    const checkCampaigns = await this.campaignModel.findOne({_id: new Types.ObjectId(campaignId)}).exec();
    if (!checkCampaigns?.publicResult) {
      return [];
    }
    return await this.voteModel
      .find({
        'campaignId': new Types.ObjectId(campaignId),
        creatorId: req.userId || null
      })
      .exec();
  }

  async getListVoteTransactionCount(campaignId: string) {
    const pipeline: any[] = [
      {
        $match: campaignId
          ? { campaignId: new Types.ObjectId(campaignId) }
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
}
