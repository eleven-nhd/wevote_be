import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Controller('campaigns')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('/create')
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Post('/get-page')
  findAll(@Body() request: PageRequestDto) {
    return this.campaignsService.findAll(request);
  }

  @Get('/get-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }

  @Get('/data-select')
  getDataSelect() {
    return this.campaignsService.getDataSelect()
  }
}
