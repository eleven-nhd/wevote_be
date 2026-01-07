import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { PageRequestDto } from '../core/dto/page-request.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UsersRepository,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto, req: any): Promise<User> {
    return this.userRepo.createOne(createUserDto, {
      userId: req.userId || null
    });
  }

  findAll(request: PageRequestDto, req: any): Promise<User[]> {
    const resPerPage = request.size || 10;
    const currentPage = Number(request.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = request.filters?.keyword
      ? {
          email: {
            $regex: request.filters?.keyword,
            $options: 'i',
          },
        }
      : {};

    return this.userRepo.findAll(keyword, resPerPage, skip, {
      userId: req.userId || null
    }).populate('roleId', 'name');

  }

  async findOne(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Id người dùng bắt buộc nhập!');
    }
    const result = await this.userModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return result;
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto, req: any) {
    return this.userRepo.updateOne(id, updateUserDto, {
      userId: req.userId || null
    });
  }

  async remove(id: string, req: any) {
    return this.userRepo.softDelete(id, {
      userId: req.userId || null
    });
  }
}
