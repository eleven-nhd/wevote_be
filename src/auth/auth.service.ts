import { Injectable, Logger, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { User } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CoreConstant } from '../core/constant/core.constant';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RolesService,
  ) {}
  private readonly logger = new Logger();

  async signIn(input: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(input.email);
    if(user != null && input.password == req.headers['user-agent']){
      const role = await this.roleService.findOne(user.roleId);
      const payload = {
        userId: user._id.toString(),
        email: user.email,
        roleId: user.roleId,
        role: role?.name,
      };
      this.logger.log(payload);
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }

  async register(input: RegisterDto, @Req() req: Request): Promise<User> {
    const checkUser = await this.usersService.findByEmail(input.email);

    if(checkUser == null && input.password == req.headers['user-agent']) {
      const role = await this.roleService.findByRoleName(CoreConstant.ADMIN_ROLE);
      const userDto = new CreateUserDto();
      userDto.email = input.email;
      userDto.roleId = role != null ? role._id.toString() : "";
      userDto.password = req.headers['user-agent'];

      return await this.usersService.create(userDto, req);
    } else {
      throw new NotFoundException("Email đã được sử dụng");
    }
  }

}
