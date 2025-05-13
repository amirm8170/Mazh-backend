import { ApiProperty } from '@nestjs/swagger';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('materials')
export class MaterialEntity {
  @ApiProperty({ example: 1, type: 'number' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 1,
    description: 'creator id',
    required: true,
    type: 'number',
  })
  @Column({ nullable: true, name: 'creator_id' })
  creatorId: number;

  @ApiProperty({
    example: 'Liter',
    description: ' unit of measure',
    required: true,
    type: 'string',
  })
  @Column({ nullable: false })
  unit: string;

  @ApiProperty({
    example: 'milk',
    description: 'material name',
    required: true,
    type: 'string',
  })
  @Index()
  @Column({ nullable: false, unique: true })
  name: string;

  @ManyToOne(() => AdminEntity, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: AdminEntity;

  @ApiProperty({ example: false })
  @Column({ nullable: false, default: false })
  isArchive: boolean;

  @ApiProperty({ example: '2025-05-09T08:56:25.303Z' })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @ApiProperty({ example: '2025-05-09T08:56:25.303Z' })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;
}
