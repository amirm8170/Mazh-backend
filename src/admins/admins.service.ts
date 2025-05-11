import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminEntity } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import * as path from 'path';
import {
  TGetAllAdminsExceptCaller,
  TUpdateAdminDetails,
  TUpdateAdminPhone,
} from './types/admin.type';
import { AdminRoleEnum } from './enum/admin-type.enum';

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

  async updateAdminDetails(payload: TUpdateAdminDetails): Promise<AdminEntity> {
    const { admin, updatedAdmin } = payload;
    const { name, lastName, description, branchId, role } = updatedAdmin;

    try {
      await this.adminRepo.update(
        { id: admin.id },
        { name, lastName, description, branchId, role },
      );
      return await this.findOne(admin.id);
    } catch (err) {
      console.log(`error happened in ${this.fileName} Error: ${err.message}`);
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateAdminPhoneNumber(
    payload: TUpdateAdminPhone,
  ): Promise<AdminEntity> {
    const { admin, phone } = payload;
    try {
      admin.phone = phone;
      return await this.adminRepo.save(admin);
    } catch (err) {
      console.log(`error happened in ${this.fileName} Error: ${err.message}`);
    }
  }

  async getAllAdminsExceptCaller(
    payload: TGetAllAdminsExceptCaller,
  ): Promise<AdminEntity[]> {
    const { role, adminId } = payload;

    try {
      if (role === AdminRoleEnum.ADMIN) {
        return await this.adminRepo.find({
          where: { role: AdminRoleEnum.EMPLOYEE, id: Not(adminId) },
        });
      } else if (role === AdminRoleEnum.SUPERADMIN) {
        return await this.adminRepo.find({
          where: [
            { role: AdminRoleEnum.ADMIN, id: Not(adminId) },
            { role: AdminRoleEnum.EMPLOYEE, id: Not(adminId) },
          ],
        });
      }

      return [];
    } catch (err) {
      console.log(`error happened in ${this.fileName} Error: ${err.message}`);
    }
  }
}
