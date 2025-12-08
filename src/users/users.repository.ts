import { Injectable } from '@nestjs/common';
import { BaseAuditRepository } from '../core/repository/base-audit.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends BaseAuditRepository<User> {
  constructor(
    @InjectModel(User.name)
    userModel: Model<User>
  ) {
    super(userModel);
  }
}