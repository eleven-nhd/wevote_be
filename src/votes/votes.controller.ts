import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query, Req,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { Public, Roles } from '../auth/decorators/public.decorator';
import { CommonResultDto } from '../core/dto/common-result.dto';

@Controller('votes')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('/create')
  async create(@Body() createVoteDto: CreateVoteDto, @Req() req: any) {
    try {
      const data = await this.votesService.create(createVoteDto, req);
      return CommonResultDto.success(data, "Thêm mới vote thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  // @Roles('admin')
  @Post('/get-page')
  findAll(@Body() request: PageRequestDto, @Req() req: any) {
    return this.votesService.findAll(request, req);
  }

  @Get('/get-by-id/:id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto, @Req() req: any) {
    try {
      const data = await this.votesService.update(id, updateVoteDto, req);
      return CommonResultDto.success(data, "Cập nhật vote thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }

  @Delete('/remove/:id')
  async remove(@Param('id') id: string, @Req() req: any) {
    try {
      const data = await this.votesService.remove(id, req);
      return CommonResultDto.success(data, "Xóa vote thành công");
    } catch (e) {
      return CommonResultDto.error("Thao tác thất bại", e.message);
    }
  }
}
