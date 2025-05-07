import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [JwtModule , AdminsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
