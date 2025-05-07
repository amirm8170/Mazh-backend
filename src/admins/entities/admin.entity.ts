import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AdminTypeEnum } from '../enum/admin-type.enum';
import { Exclude } from 'class-transformer';

@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false  , type:'varchar'})
  phone: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: false, type: 'enum', enum: AdminTypeEnum })
  type: AdminTypeEnum;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ nullable: true, name: 'last_name' })
  lastName: string;

  @Column({ nullable: false, default: false, name: 'is_archive' })
  isArchive: boolean;

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
