import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { AuditSchema } from '../../core/schema/audit.schema';

@Schema()
export class Campaign extends AuditSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: "" })
  description: string;

  @Prop({ default: "" })
  featureImage: string;

  @Prop({ default: false })
  publicResult: boolean;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
