import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { Transaction } from './schema/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return await this.transactionModel.create(createTransactionDto);
  }

  findAll(request: PageRequestDto): Promise<Transaction[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.keyword
      ? {
        name: {
          $regex: request.keyword,
          $options: 'i',
        },
      }
      : {};
    return this.transactionModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
  }

  findOne(id: string) {
    return this.transactionModel
      .findOne({ _id: id })
      .populate({
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
