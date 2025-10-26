import { Injectable, Logger, Req, UnauthorizedException } from '@nestjs/common';
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
    private roleService: RolesService,
  ) {}
  private readonly logger = new Logger();

  async signIn(input: LoginDto, @Req() req: Request): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(input.email);
    if(user != null && input.password == req.headers['user-agent']){
      this.logger.log("user", user._id.id);
      const role = await this.roleService.findOne(user.roleId);
      const payload = {
        userId: user._id.toString(),
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
