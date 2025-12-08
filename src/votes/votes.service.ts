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
import { PageRequestDto } from '../core/dto/page-request.dto';
import { Role } from '../roles/schema/role.schema';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto): Promise<Vote> {
    return await this.voteModel.create(createVoteDto);
  }

  findAll(request: PageRequestDto): Promise<Role[]> {
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
    return this.voteModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Id Vote bắt buộc nhập!');
    }
      const result = await this.voteModel.findOne({ _id: id }).populate('campaignId', 'name');;
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
