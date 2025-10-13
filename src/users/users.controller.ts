import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards, Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/decorators/public.decorator';
import { PageRequestDto } from '../core/dto/page-request.dto';

@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  @Roles('sa')
  create(@Body() createUserDto: CreateUserDto) {

    return this.usersService.create(createUserDto);
  }
  @Roles('sa')
  @Post('/get-page')
  findAll(@Body() request: PageRequestDto) {
    return this.usersService.findAll(request);
  }
  @Roles('sa')
  @Get('/get-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
  @Roles('sa')
  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
  @Roles('sa')
  @Delete('/remove/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
