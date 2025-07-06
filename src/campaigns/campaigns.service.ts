import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Query } from 'express-serve-static-core';
import { Campaign } from './schema/campaign.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return await this.campaignModel.create(createCampaignDto);
  }

  async findAll(query: Query): Promise<Campaign[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          email: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const result = await this.campaignModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return result;
  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Id Campaign bắt buộc nhập!');
    }
    const result = await this.campaignModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy Campaign');
    }
    return result;
  }

  update(id: string, updateCampaignDto: UpdateCampaignDto) {
    return this.campaignModel
      .findByIdAndUpdate({ _id: id }, updateCampaignDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    const result = await this.campaignModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return result;
  }
}
