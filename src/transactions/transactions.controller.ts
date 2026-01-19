import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Public } from '../auth/decorators/public.decorator';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Public()
  @Post('/create')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Post('/get-page')
  findAll(@Body() request: PageRequestDto, @Req() req: any) {
    return this.transactionsService.findAll(request, req);
  }

  @Get('/get-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }

  @Get('/get-by-voter-and-vote/:voteId/:voterId')
  @Public()
  findByVoterAndVote(@Param('voterId') voterId: string, @Param('voteId') voteId: string) {
    return this.transactionsService.findByVoterAndVote(voterId, voteId);
  }
}
