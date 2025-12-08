import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { OptionVoteDto } from '../dto/option-vote.dto';

@Schema()
export class Vote {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  featureImage: string;

  @Prop()
  options: OptionVoteDto[];

  @Prop()
  renderType: number;

  @Prop()
  tags: string[];

  @Prop({ type: Types.ObjectId, ref: 'Campaign' })
  campaignId: string;

  @Prop()
  createdDate: Date;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
