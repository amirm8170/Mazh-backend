import { UpdateAdminDetailsDto } from '../dto/update-admin.dto';
import { AdminEntity } from '../entities/admin.entity';
import { AdminRoleEnum } from '../enum/admin-type.enum';

export type TUpdateAdminDetails = {
  admin: AdminEntity;
  updatedAdmin: UpdateAdminDetailsDto;
};

export type TUpdateAdminPhone = {
  admin: AdminEntity;
  phone: string;
};

export type TGetAllAdminsExceptCaller = {
  adminId: number;
  role: AdminRoleEnum;
};
