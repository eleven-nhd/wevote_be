import { Get, Injectable, NotFoundException, Param, Req } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from './schema/role.schema';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { RolesRepository } from './roles.repository';
import { DataSelectDto } from '../core/dto/data-select.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly roleRepo: RolesRepository,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto, req: any): Promise<Role> {
    return this.roleRepo.createOne(createRoleDto, {
      userId: req.userId || null
    });
  }

  findAll(request: PageRequestDto, req: any): Promise<Role[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.keyword
      ? {
          name: {
            $regex: request.keyword,
            $options: 'i',
          },
        }
      : {};
    return this.roleRepo.findAll(keyword, resPerPage, skip, {
      userId: req.userId || null
    });
  }

  async findByRoleName(roleName: string) {
    const result = await this.roleModel.findOne({ name: roleName }).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy vai trò');
    }
    return result;
  }

  findOne(id: string) {
    return this.roleModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, req: any) {
    return this.roleRepo.updateOne(id, updateRoleDto, {
      userId: req.userId || null
    });
  }

  async remove(id: string, req: any) {
    return this.roleRepo.softDelete(id, {
      userId: req.userId || null
    });
  }

  async getDataSelect(req: any): Promise<DataSelectDto[]> {
    const roles = this.roleModel.find({creatorId: req.userId || null}).exec();
    return roles.then((res) => {
      return res.map((role) => {
        return {
          label: role.name,
          value: role._id,
        };
      });
    });
  }
}
