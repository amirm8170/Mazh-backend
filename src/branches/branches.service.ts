import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchEntity } from './entities/branch.entity';
import { Repository } from 'typeorm';
import { TUpdateBranch } from './types/branch.type';
import * as path from 'path';

@Injectable()
export class BranchesService {
  private fileName = path.basename(__filename);
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
  ) {}

  async create(payload: CreateBranchDto): Promise<BranchEntity> {
    const branch = this.branchRepo.create(payload);

    return await this.branchRepo.save(branch);
  }

  async findAll(): Promise<BranchEntity[]> {
    const branches = await this.branchRepo.find({
      where: { isArchive: false },
      relations: {
        admins: true,
      },
    });
    // filter archived admins
    return branches.map((branch) => ({
      ...branch,
      admins: branch.admins.filter((admin) => !admin.isArchive),
    }));
  }

  async findByAdminId(adminId: number): Promise<BranchEntity[]> {
    try {
      return await this.branchRepo
        .createQueryBuilder('branch')
        .leftJoinAndSelect('branch.admins', 'admins')
        .where('admins.id = :adminId', { adminId })
        .getMany();
    } catch (err) {
      console.log(
        `error happened in ${this.fileName} findById method, Error: ${err.message}`,
      );
      throw new InternalServerErrorException(err.message);
    }
  }

  async findOne(id: number): Promise<BranchEntity> {
    return await this.branchRepo.findOne({ where: { id, isArchive: false } });
  }

  async update(payload: TUpdateBranch): Promise<BranchEntity> {
    try {
      const { branchId, updatedBranch } = payload;

      await this.branchRepo.update(
        { id: branchId, isArchive: false },
        { ...updatedBranch },
      );

      return await this.findOne(branchId);
    } catch (err) {
      console.log(
        `error happened in ${this.fileName} in update method, Error: ${err.message}`,
      );
      throw new InternalServerErrorException(err.message);
    }
  }

  async archive(id: number): Promise<void> {
    await this.branchRepo.update({ id, isArchive: false }, { isArchive: true });
    return;
  }
}
