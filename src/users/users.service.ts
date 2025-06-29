import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import mongoose, { Model } from 'mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userModel.create(createUserDto);
  }

  async findAll(query: Query): Promise<User[]> {
    const resPerPage = 5;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const keyword = query.keyword
      ? {
          email: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const result = await this.userModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return result;
  }

  async findOne(id: number) {
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

  async findByEmail(email: string): Promise<User> {
    const result = await this.userModel.findOne({ email: email }).exec();
    if (!result) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return result;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate({ _id: id }, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: number) {
    const result = await this.userModel.findByIdAndDelete({ _id: id }).exec();
    return result;
  }
}
