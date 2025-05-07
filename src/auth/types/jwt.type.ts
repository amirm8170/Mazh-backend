import { AdminTypeEnum } from 'src/admins/enum/admin-type.enum';

export type TJwtPayload = {
  id: number;
  phone: number;
  adminType?: AdminTypeEnum | null;
};
