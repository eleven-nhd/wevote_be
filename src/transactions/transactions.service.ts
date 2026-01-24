import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Campaign } from '../campaigns/schema/campaign.schema';
import { PageRequestDto } from 'src/core/dto/page-request.dto';
import { RealtimeGateway } from '../core/gateway/realtime.gateway';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<Campaign>,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ) {
    const checkTransaction = await this.transactionModel.findOne({
      voterId: createTransactionDto.voterId,
      voteId: createTransactionDto.voteId,
    });
    const checkCampaign = await this.campaignModel.findOne({
      _id: createTransactionDto.campaignId
    });
    if (checkCampaign) {
      if(checkCampaign.endTime < new Date())
      {
        throw new BadRequestException('Chiến dịch đã kết thúc');
      }
    }
    if (!checkTransaction) {
      const result = await this.transactionModel.create(createTransactionDto)
      this.realtimeGateway.emitTableUpdate({
        type: 'CREATE',
        payload: result,
      });
      return result;
    } else {
      const result = await this.transactionModel.findByIdAndUpdate(
        { _id: checkTransaction._id }, createTransactionDto, { new: true });
      this.realtimeGateway.emitTableUpdate({
        type: 'UPDATE',
        payload: result,
      });
      return result;
    }

  }

  async findAll(request: PageRequestDto, req: any) {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const payload = request.filters?.voteId ? {
      'voteId': new Types.ObjectId(request.filters?.voteId),
      'creatorCampaignId': new Types.ObjectId(req?.userId)
    } : {
      'creatorCampaignId': new Types.ObjectId(req?.userId)
    };

    const queryFilter: any = {
      ...payload
    };

    const [items, total] = await Promise.all([
      this.transactionModel
        .find(queryFilter)
        .populate({
          path: 'voteId',
          select: 'name description campaignId',
          populate: {
            path: 'campaignId',
            select: 'name',
          },
        })
        .limit(resPerPage)
        .skip(skip),
      this.transactionModel.countDocuments(queryFilter),
    ]);

    return { items, total };
  }

  findOne(id: string) {
    return this.transactionModel.findOne({ _id: id }).populate({
      path: 'voteId',
      select: 'name description campaignId',
      populate: {
        path: 'campaignId',
        select: 'name',
      },
    });
  }

  findByVoterAndVote(voterId: string, voteId: string) {
    return this.transactionModel.findOne({
      voterId: voterId,
      voteId: new Types.ObjectId(voteId)
    });
  }

  async update(id: string, updateUserDto: UpdateTransactionDto) {
    return this.transactionModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.transactionModel.findByIdAndDelete({ _id: id }).exec();
  }
}
