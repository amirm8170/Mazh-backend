import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { JwtGlobalModule } from 'src/modules/jwt.module';

@Module({
  imports: [JwtGlobalModule, AdminsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
