import { Model } from "mongoose";
import { AuditSchema } from '../schema/audit.schema';
import { Logger } from '@nestjs/common';

export class BaseAuditRepository<T extends AuditSchema> {
  private readonly logger = new Logger();
  constructor(private readonly model: Model<T>) {}

  private getUserId(options?: { userId?: string }): string | null {
    return options?.userId ?? null;
  }

  async createOne(dto: Partial<T>, options?: { userId?: string }) {
    const userId = this.getUserId(options);

    const data: any = {
      ...dto,
      creationTime: new Date(),
      creatorId: userId ?? null,
    };

    return await this.model.create(data);
  }

  async updateOne(id: string, dto: Partial<T>, options?: { userId?: string }) {
    const userId = this.getUserId(options);

    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        ...dto,
        modificationTime: new Date(),
        modifierId: userId ?? null,
      },
      { new: true }
    );
  }

  async softDelete(id: string, options?: { userId?: string }) {
    const userId = this.getUserId(options);

    return this.model.findByIdAndUpdate(
      { _id: id },
      {
        isDeleted: true,
        deletionTime: new Date(),
        deleterId: userId ?? null,
      },
      { new: true }
    );
  }

  findAll(filter: any = {}, resPerPage: number = 10, skip: number = 0, options?: { userId?: string }) {
    const userId = this.getUserId(options);
    const queryFilter: any = {
      ...filter,
      isDeleted: false,
    };
    if (userId) {
      queryFilter.creatorId = userId;
    }
    return this.model
      .find(queryFilter)
      .limit(resPerPage)
      .skip(skip);
  }
}
