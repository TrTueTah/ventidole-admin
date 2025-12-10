import { PagingREQ } from '@/types/paging.type';

export enum CommunitySortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export type GetCommunitiesREQ = {
  search?: string;
  sortBy?: CommunitySortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
} & PagingREQ;
