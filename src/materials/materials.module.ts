import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';
import { AdminsModule } from 'src/admins/admins.module';
import { AdminEntity } from 'src/admins/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialEntity, AdminEntity]),
    AdminsModule,
  ],
  controllers: [MaterialsController],
  providers: [MaterialsService],
  exports: [MaterialsService],
})
export class MaterialsModule {}
