import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    CampaignsModule,
    CoreModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [
    TransactionsService,
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
  ],
})
export class TransactionsModule {}
