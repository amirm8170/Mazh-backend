import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BranchEntity } from './entities/branch.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(BranchEntity)
    private readonly branchRepo: Repository<BranchEntity>,
  ) {}

  async create(payload: CreateBranchDto): Promise<BranchEntity> {
    const branch = this.branchRepo.create(payload);

    return await this.branchRepo.save(branch);
  }

  async findAll(): Promise<BranchEntity[]> {
    return await this.branchRepo.find({
      relations: {
        admins: true,
      },
    });
  }

  async findOne(id: number): Promise<BranchEntity> {
    return await this.branchRepo.findOneBy({ id });
  }

  update(id: number, updateBranchDto: UpdateBranchDto) {
    return `This action updates a #${id} branch`;
  }

  remove(id: number) {
    return `This action removes a #${id} branch`;
  }
}
