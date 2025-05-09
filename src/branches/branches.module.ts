import { forwardRef, Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import { BranchEntity } from './entities/branch.entity';
import { AdminsModule } from 'src/admins/admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity, BranchEntity]),
    forwardRef(() => AdminsModule),
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}
