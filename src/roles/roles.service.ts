import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.roleModel.create(createRoleDto);
  }

  findAll(request: PageRequestDto): Promise<Role[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.keyword
      ? {
          email: {
            $regex: request.keyword,
            $options: 'i',
          },
        }
      : {};
    return this.roleModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
  }

  findOne(id: string) {
    return this.roleModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateUserDto: UpdateRoleDto) {
    return this.roleModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return await this.roleModel.findByIdAndDelete({ _id: id }).exec();
  }
}
