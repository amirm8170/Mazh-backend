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
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true, type: 'varchar' })
  description: string;

  @Column({ nullable: false, default: false, name: 'is_archive' })
  isArchive: boolean;

  @OneToMany(() => AdminEntity, (admin) => admin.branch)
  admins: AdminEntity[];

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
