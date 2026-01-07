import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schema/vote.schema';
import { VotesRepository } from './votes.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
  ],
  controllers: [VotesController],
  providers: [VotesService, VotesRepository],
  exports: [
    VotesService,
    MongooseModule.forFeature([{ name: Vote.name, schema: VoteSchema }]),
  ],
})
export class VotesModule {}
