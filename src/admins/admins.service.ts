import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}

  create(createAdminDto: CreateAdminDto) {
    throw new NotImplementedException();
  }

  findAll() {
    return `This action returns all admins`;
  }

  async findOne(id: number): Promise<AdminEntity> {
    return await this.adminRepo.findOneBy({ id, isArchive: false });
  }

  async findByPhone(phone: number): Promise<AdminEntity> {
    return await this.adminRepo.findOneBy({ phone, isArchive: false });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
