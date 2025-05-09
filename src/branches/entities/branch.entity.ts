import { ApiProperty } from '@nestjs/swagger';
import { AdminEntity } from 'src/admins/entities/admin.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('branches')
export class BranchEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ type: 'number', example: 1 })
  id: number;

  @ApiProperty({ type: 'string', example: 'name' })
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ type: 'string', example: 'address' })
  @Column({ nullable: true, type: 'varchar' })
  address: string;

  @ApiProperty({ type: 'string', example: '09124356343' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty({ type: 'string', example: 'description' })
  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @ApiProperty({
    example: false,
    type: 'boolean',
  })
  @Column({ nullable: false, default: false, name: 'is_archive' })
  isArchive: boolean;

  @OneToMany(() => AdminEntity, (admin) => admin.branch)
  admins: AdminEntity[];

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
