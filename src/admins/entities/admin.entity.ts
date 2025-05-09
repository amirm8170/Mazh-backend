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
import { AdminRoleEnum } from '../enum/admin-type.enum';
import { Exclude } from 'class-transformer';
import { BranchEntity } from 'src/branches/entities/branch.entity';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index()
  phone: string;

  @Column({ nullable: true, name: 'branch_id' })
  branchId: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, type: 'enum', enum: AdminRoleEnum })
  role: AdminRoleEnum;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ nullable: false, default: false, name: 'is_archive' })
  isArchive: boolean;

  @ManyToOne(() => BranchEntity, (branch) => branch.admins, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt: Date;
}
