import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Campaign } from '../campaigns/schema/campaign.schema';
import { PageRequestDto } from 'src/core/dto/page-request.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<Campaign>
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
      return await this.transactionModel.create(createTransactionDto);
    } else {
      return this.transactionModel.findByIdAndUpdate({ _id: checkTransaction._id }, createTransactionDto, { new: true });
    }

  }

  findAll(request: PageRequestDto, req: any): Promise<Transaction[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const payload = request.filters?.voteId ? {
      'voteId': new Types.ObjectId(request.filters?.voteId),
      'creatorCampaignId': new Types.ObjectId(req?.userId)
    } : {
      'creatorCampaignId': new Types.ObjectId(req?.userId)
    };

    return this.transactionModel
      .find(payload)
      .populate({
        path: 'voteId',
        select: 'name description campaignId',
        populate: {
          path: 'campaignId',
          select: 'name',
        },
      })
      .limit(resPerPage)
      .skip(skip);
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

  async update(id: string, updateUserDto: UpdateTransactionDto) {
    return this.transactionModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.transactionModel.findByIdAndDelete({ _id: id }).exec();
  }
}
