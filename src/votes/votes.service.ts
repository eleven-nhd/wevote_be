import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './schema/vote.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { VotesRepository } from './votes.repository';
import { DataSelectDto } from '../core/dto/data-select.dto';

@Injectable()
export class VotesService {
  constructor(
    private readonly voteRepo: VotesRepository,
    @InjectModel(Vote.name) private readonly voteModel: Model<Vote>,
  ) {}

  async create(createVoteDto: CreateVoteDto, req: any): Promise<Vote> {
    return this.voteRepo.createOne(createVoteDto, {
      userId: req.userId || null
    });
  }

  findAll(request: PageRequestDto, req: any): Promise<Vote[]> {
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
    const campaignId = request.filters?.campaignId ? {
      'campaignId': new Types.ObjectId(request.filters?.campaignId),
    } : {};

    return this.voteRepo.findAll({...keyword, ...campaignId}, resPerPage, skip, {
      userId: req.userId || null
    }).populate('campaignId', 'name');
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Id Vote bắt buộc nhập!');
    }
      const result = await this.voteModel.findOne({ _id: id }).populate('campaignId', 'name');
    if (!result) {
      throw new NotFoundException('Không tìm thấy Vote');
    }
    return result;
  }

  update(id: string, updateVoteDto: UpdateVoteDto, req: any) {
    return this.voteRepo.updateOne(id, updateVoteDto, {
      userId: req.userId || null
    });
  }

  async remove(id: string, req: any) {
    return this.voteRepo.softDelete(id, {
      userId: req.userId || null
    });
  }

  async getDataSelect(req: any): Promise<DataSelectDto[]> {
    const vote = this.voteModel.find({creatorId: req.userId || null}).exec();
    return vote.then((res) => {
      return res.map((vote) => {
        return {
          label: vote.name,
          value: vote._id,
        };
      });
    });
  }
}
