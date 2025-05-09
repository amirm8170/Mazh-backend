import { AdminRoleEnum } from 'src/admins/enum/admin-type.enum';

export type TJwtPayload = {
  id: number;
  phone: string;
  role?: AdminRoleEnum | null;
};
