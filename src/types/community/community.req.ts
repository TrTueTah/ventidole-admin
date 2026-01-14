import { PagingREQ } from '@/types/paging.type';

export enum CommunitySortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}

export enum CommunityType {
  SOLO = 'SOLO',
  GROUP = 'GROUP',
}

export type GetCommunitiesREQ = {
  search?: string;
  sortBy?: CommunitySortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
} & PagingREQ;

export type CreateCommunityREQ = {
  name: string;
  description?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  communityType: CommunityType;
};

export type UpdateCommunityREQ = {
  name?: string;
  description?: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  isActive?: boolean;
};
