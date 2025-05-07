import { AdminTypeEnum } from 'src/admins/enum/admin-type.enum';

export type TJwtPayload = {
  id: number;
  phone: string;
  type?: AdminTypeEnum | null;
};
