import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schemas';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const createdUser = await this.roleModel.create(createRoleDto);
    return createdUser;
  }

  findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  findOne(id: number) {
    return this.roleModel.findOne({ _id: id }).exec();
  }

  async update(id: number, updateUserDto: UpdateRoleDto) {
    return this.roleModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: number) {
    const deletedCat = await this.roleModel
      .findByIdAndDelete({ _id: id })
      .exec();
    return deletedCat;
  }
}
