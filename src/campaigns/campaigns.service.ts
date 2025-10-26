import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Campaign } from './schema/campaign.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataSelectDto } from '../core/dto/data-select.dto';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name) private readonly campaignModel: Model<Campaign>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    return await this.campaignModel.create(createCampaignDto);
  }

  findAll(request: PageRequestDto): Promise<Campaign[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.keyword
      ? {
        email: {
          $regex: request.keyword,
          $options: 'i',
        },
      }
      : {};
    return this.campaignModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
  }

  async getDataSelect(): Promise<DataSelectDto[]> {
    const campaign = this.campaignModel.find().exec();
    return campaign.then((res) => {
      return res.map((campaign) => {
        return {
          label: campaign.name,
          value: campaign.id,
        };
      });
    });
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
