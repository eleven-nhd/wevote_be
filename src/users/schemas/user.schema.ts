import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuditSchema } from '../../core/schema/audit.schema';

@Schema()
export class User extends AuditSchema {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'Role' })
  roleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
