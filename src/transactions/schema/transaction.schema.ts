import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  voterId: string;

  @Prop()
  choose: number;

  @Prop({ type: Types.ObjectId, ref: 'Vote', required: true })
  voteId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true  })
  campaignId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true  })
  creatorCampaignId: Types.ObjectId;

  @Prop({ type: Date, default: null })
  creationTime?: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
