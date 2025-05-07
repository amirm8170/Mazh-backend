import {
  Controller,
  Post,
  Body,
  NotImplementedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto, UserLoginDto } from './dto/create-auth.dto';
import { AdminsService } from 'src/admins/admins.service';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { instanceToPlain } from 'class-transformer';
import { TJwtPayload } from './types/jwt.type';
import { Public } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminsService,
  ) {}

  @Public()
  @Post('admin-login')
  async adminLogin(@Body() payload: AdminLoginDto): Promise<{
    admin: Partial<AdminEntity>;
    accessToken: string;
    refreshToken: string;
  }> {
    const { phoneNumber, password } = payload;
    const admin = await this.adminService.findByPhone(phoneNumber);
    if (!admin) throw new NotFoundException(`admin not found`);

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) throw new UnauthorizedException('invalid password');

    const tokenPayload: TJwtPayload = {
      id: admin.id,
      phone: admin.phone,
      type: admin.type,
    };
    const accessToken = this.authService.createAccessToken(tokenPayload);
    const refreshToken = this.authService.createRefreshToken(tokenPayload);

    return { admin: instanceToPlain(admin), accessToken, refreshToken };
  }

  @Public()
  @Post('user-login')
  userLogin(@Body() userLoginDto: UserLoginDto) {
    throw new NotImplementedException();
  }
}
