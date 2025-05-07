import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity])],
  controllers: [AdminsController],
  providers: [AdminsService, JwtService],
  exports: [AdminsService],
})
export class AdminsModule {}
