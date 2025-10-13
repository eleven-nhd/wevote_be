import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RolesService } from '../roles/roles.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/loginResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RolesService
  ) {}

  async signIn(input: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(input.email);
    if(user != null && input.password == req.headers['user-agent']){
      const role = await this.roleService.findOne(user.roleId);
      const payload = {
        sub: user.id,
        email: user.email,
        roleId: user.roleId,
        role: role?.name,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    throw new UnauthorizedException();
  }
}
