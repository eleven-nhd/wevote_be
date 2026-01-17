import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards, Req,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { CommonResultDto } from '../core/dto/common-result.dto';
import { Campaign } from './schema/campaign.schema';
import { Public } from '../auth/decorators/public.decorator';

@Controller('campaigns')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('/create')
  async create(@Body() createCampaignDto: CreateCampaignDto, @Req() req: any): Promise<CommonResultDto<Campaign>> {
    try {
      const data = await this.campaignsService.create(createCampaignDto, req);
      return CommonResultDto.success(data, "Thêm mới chiến dịch thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  @Post('/get-page')
  findAll(@Body() request: PageRequestDto, @Req() req: any) {
    return this.campaignsService.findAll(request, req);
  }

  @Get('/get-by-id/:id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.campaignsService.findOne(id);
      return CommonResultDto.success(data, "Thêm mới chiến dịch thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Req() req: any
  ) {
    try {
      const data = await this.campaignsService.update(id, updateCampaignDto, req);
      return CommonResultDto.success(data, "Cập nhật chiến dịch thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  @Delete('/remove/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      const data = await this.campaignsService.remove(id, req);
      return CommonResultDto.success(data, "Xóa chiến dịch thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  @Get('/data-select')
  getDataSelect(@Req() req: any) {
    return this.campaignsService.getDataSelect(req);
  }

  @Get('/get-list-vote/:campaignId')
  @Public()
  getListVoteByCampaignId(@Param('campaignId') campaignId: string, @Req() req: any) {
    return this.campaignsService.getListVoteByCampaignId(campaignId, req);
  }

  @Public()
  @Get('/get-list-vote-transaction/:campaignId')
  getListVoteTransactionByCampaignId(@Param('campaignId') campaignId: string) {
    return this.campaignsService.getListVoteTransactionCount(campaignId);
  }
}
