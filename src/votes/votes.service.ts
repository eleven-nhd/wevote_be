import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './schema/vote.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    return await this.voteModel.create(createVoteDto);
  }

  async findAll(query: Query): Promise<Vote[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const result = await this.voteModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return result;
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Id Vote bắt buộc nhập!');
    }
    const result = await this.voteModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy Vote');
    }
    return result;
  }

  update(id: string, updateVoteDto: UpdateVoteDto) {
    return this.voteModel
      .findByIdAndUpdate({ _id: id }, updateVoteDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.voteModel.findByIdAndDelete({ _id: id }).exec();
  }
}
