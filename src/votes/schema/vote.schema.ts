import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { OptionVoteDto } from '../dto/option-vote.dto';
import { AuditSchema } from '../../core/schema/audit.schema';

@Schema()
export class Vote extends AuditSchema {

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string | null;

  @Prop()
  featureImage?: string | null;

  @Prop()
  options: OptionVoteDto[];

  @Prop()
  renderType: number;

  @Prop()
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  campaignId: Types.ObjectId;

  @Prop()
  createdDate: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
