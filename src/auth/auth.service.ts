import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TJwtPayload } from './types/jwt.type';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  createAccessToken(payload: TJwtPayload): string {
    console.log(process.env.JWT_ACCESS_TOKEN_SECRET);
    return this.jwtService.sign(
      { ...payload },
      { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: '30d' },
    );
  }

  createRefreshToken(payload: TJwtPayload): string {
    return this.jwtService.sign(
      { ...payload },
      { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: '1y' },
    );
  }
}
