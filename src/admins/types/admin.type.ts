import { UpdateAdminDetailsDto } from '../dto/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';

export type TUpdateAdminDetails = {
  admin: AdminEntity;
  updatedAdmin: UpdateAdminDetailsDto;
};

export type TUpdateAdminPhone = {
  admin: AdminEntity;
  phone: string;
};
