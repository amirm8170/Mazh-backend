import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { JwtService } from '@nestjs/jwt';
import { BranchEntity } from 'src/branches/entities/branch.entity';
import { BranchesModule } from 'src/branches/branches.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity , BranchEntity]), BranchesModule],
  controllers: [AdminsController],
  providers: [AdminsService, JwtService],
  exports: [AdminsService],
})
export class AdminsModule {}
