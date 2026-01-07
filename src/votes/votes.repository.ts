import { Injectable } from '@nestjs/common';
import { BaseAuditRepository } from '../core/repository/base-audit.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vote } from './schema/vote.schema';

@Injectable()
export class VotesRepository extends BaseAuditRepository<Vote> {
  constructor(
    @InjectModel(Vote.name)
    voteModel: Model<Vote>
  ) {
    super(voteModel);
  }

}