import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class Transaction {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  voterId: string;

  @Prop()
  choose: number;

  @Prop({ type: Types.ObjectId, ref: 'Vote' })
  voteId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
