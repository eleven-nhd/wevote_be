import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { AuditSchema } from '../../core/schema/audit.schema';

@Schema()
export class Role extends AuditSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
