import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';

@Injectable()
export class AdminsService {
  private fileName = path.basename(__filename);

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
  ) {}

  async findOne(id: number): Promise<AdminEntity> {
    return await this.adminRepo.findOneBy({ id, isArchive: false });
  }

  async findByPhone(phone: string): Promise<AdminEntity> {
    return await this.adminRepo.findOneBy({ phone, isArchive: false });
  }

  async create(admin: CreateAdminDto): Promise<AdminEntity> {
    try {
      const bluePrint = this.adminRepo.create(admin);

      return await this.adminRepo.save(bluePrint);
    } catch (err) {
      console.log(
        `error happened in ${this.fileName} file in create method, Err: ${err.message} `,
      );
      throw new InternalServerErrorException(err.message);
    }
  }
}
