import { AccountRole } from '@/enums/role.enum';
import { CommunityInfoDto } from '../community/community.dto';

export type UserDto = {
  id: string;
  email: string;
  username: string;
  role: AccountRole;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  isActive: boolean;
  isOnline: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UserDetailDto = UserDto & {
  community?: CommunityInfoDto;
};
