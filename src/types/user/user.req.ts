import { AccountRole } from '@/enums/role.enum';
import { PagingREQ } from '@/types/paging.type';

export enum UserSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  EMAIL = 'email',
  USERNAME = 'username',
  ROLE = 'role',
}

export type GetUsersREQ = {
  search?: string;
  sortBy?: UserSortBy;
  sortOrder?: 'asc' | 'desc';
  role?: AccountRole;
  isActive?: boolean;
} & PagingREQ;

export type CreateUserREQ = {
  email: string;
  username: string;
  password: string;
  role?: AccountRole;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  communityId?: string;
};
