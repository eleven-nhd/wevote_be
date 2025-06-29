import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: SchemaTypes.ObjectId })
  id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop()
  description: string;

  @Prop()
  createdDate: Date;

  @Prop()
  lastestDate: Date;

  @Prop()
  roleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
