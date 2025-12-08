import { Prop } from '@nestjs/mongoose';

export abstract class AuditSchema {
  @Prop({ type: Date, default: null })
  creationTime?: Date;

  @Prop({ type: String, default: null })
  @Prop({ immutable: true })
  creatorId?: string;

  @Prop({ type: Date, default: null })
  @Prop({ immutable: true })
  modificationTime?: Date;

  @Prop({ type: String, default: null })
  modifierId?: string;

  @Prop({ type: Boolean, default: false })
  isDeleted?: boolean;

  @Prop({ type: Date, default: null })
  deletionTime?: Date;

  @Prop({ type: String, default: null })
  deleterId?: string;
}
