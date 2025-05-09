import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';

export type TUpdateAdmin = {
  admin: AdminEntity;
  updatedAdmin: UpdateAdminDto;
};
