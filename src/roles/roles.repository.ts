import { Injectable } from '@nestjs/common';
import { BaseAuditRepository } from '../core/repository/base-audit.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';

@Injectable()
export class RolesRepository extends BaseAuditRepository<Role> {
  constructor(
    @InjectModel(Role.name)
    roleModel: Model<Role>
  ) {
    super(roleModel);
  }
}