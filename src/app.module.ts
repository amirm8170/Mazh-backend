import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/db.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AdminAccessGuard } from './auth/guards/admin-access.guard';
import { BranchesModule } from './branches/branches.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    UsersModule,
    AdminsModule,
    BranchesModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard, AdminAccessGuard],
})
export class AppModule {}
