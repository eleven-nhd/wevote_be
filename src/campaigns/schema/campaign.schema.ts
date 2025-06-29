import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class Campaign {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  featureImage: string;

  @Prop()
  publicResult: boolean;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop()
  userId: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
