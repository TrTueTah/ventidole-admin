import { AccountRole } from '@/enums/role.enum';

export type LoginRESP = {
  userId: string;
  email: string;
  role: AccountRole;
  name: string;
  accessToken: string;
  refreshToken: string;
};
