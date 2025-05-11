import {
  BeforeInsert,
  BeforeUpdate,
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
import { BranchEntity } from 'src/branches/entities/branch.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('admins')
export class AdminEntity {
  @ApiProperty({
    example: 1,
    type: 'number',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '092334324332',
    type: 'string',
  })
  @Column({ nullable: false })
  @Index()
  phone: string;

  @ApiProperty({
    example: 1,
    type: 'number',
  })
  @Column({ nullable: true, name: 'branch_id' })
  branchId: number;

  @ApiProperty({
    example: 'name',
    type: 'string',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    example: AdminRoleEnum.EMPLOYEE,
    enum: AdminRoleEnum,
  })
  @Column({ nullable: false, type: 'enum', enum: AdminRoleEnum })
  role: AdminRoleEnum;

  @ApiProperty({
    example: 'lastName',
    type: 'string',
  })
  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @ApiProperty({
    example: false,
    type: 'boolean',
  })
  @Column({ nullable: false, default: false, name: 'is_archive' })
  isArchive: boolean;

  @ManyToOne(() => BranchEntity, (branch) => branch.admins, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'branch_id' })
  branch: BranchEntity;

  @ApiProperty({
    example: 'description',
    type: 'string',
  })
  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @ApiProperty({
    example: false,
    type: 'boolean',
    default: false,
  })
  @Column({ nullable: true, default: false , name:'is_active' })
  isActive: boolean;

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

  @BeforeInsert()
  @BeforeUpdate()
  checkAdminActive() {
    if (!this.name || !this.lastName) {
      this.isActive = false;
    } else {
      this.isActive = true;
    }
  }
}
