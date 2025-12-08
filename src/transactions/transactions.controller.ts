import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('/create')
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Post('/get-page')
  findAll(@Body() request: PageRequestDto) {
    return this.transactionsService.findAll(request);
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
}
