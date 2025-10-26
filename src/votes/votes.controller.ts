import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { Roles } from '../auth/decorators/public.decorator';

@Controller('votes')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post('/create')
  create(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(createVoteDto);
  }

  // @Roles('admin')
  @Post('/get-page')
  findAll(@Body() request: PageRequestDto) {
    return this.votesService.findAll(request);
  }

  @Get('/get-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.votesService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.votesService.update(id, updateVoteDto);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.votesService.remove(id);
  }
}
