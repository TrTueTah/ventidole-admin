import { PagingREQ } from '@/types/paging.type';

export enum ShopSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export type GetShopsREQ = {
  search?: string;
  sortBy?: ShopSortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  idolId?: string;
} & PagingREQ;

export type CreateShopREQ = {
  name: string;
  description?: string;
  avatarUrl?: string;
  communityId: string;
  isActive?: boolean;
};

export type UpdateShopREQ = Partial<CreateShopREQ>;
