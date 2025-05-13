import { Injectable } from '@nestjs/common';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialEntity } from './entities/material.entity';
import { Repository } from 'typeorm';
import { TCreateMaterial, TUpdateMaterial } from './types/material.types';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepo: Repository<MaterialEntity>,
  ) {}

  async create(payload: TCreateMaterial): Promise<MaterialEntity> {
    const { materialPayload, creatorId } = payload;

    const material = this.materialRepo.create({
      creatorId,
      ...materialPayload,
    });
    return await this.materialRepo.save(material);
  }

  findByName(name: string): Promise<MaterialEntity> {
    return this.materialRepo.findOne({
      where: { name, isArchive: false },
    });
  }

  findAll(): Promise<MaterialEntity[]> {
    return this.materialRepo.find({
      relations: { creator: true },
      where: { isArchive: false },
    });
  }

  async update(payload: TUpdateMaterial): Promise<MaterialEntity> {
    const { id, updatedPayload, creatorId } = payload;
    await this.materialRepo.update(
      { id, isArchive: false },
      { ...updatedPayload, creatorId },
    );
    return await this.findById(id);
  }

  findById(id: number): Promise<MaterialEntity> {
    return this.materialRepo.findOneBy({ id, isArchive: false });
  }

  archive(material: MaterialEntity): Promise<MaterialEntity> {
    material.isArchive = true;
    return this.materialRepo.save(material);
  }
}
