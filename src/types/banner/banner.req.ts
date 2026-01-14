import { PagingREQ } from '@/types/paging.type';

export enum BannerSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  START_DATE = 'startDate',
  END_DATE = 'endDate',
  ORDER = 'order',
}

export type GetBannersREQ = {
  search?: string;
  sortBy?: BannerSortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
} & PagingREQ;

export type CreateBannerREQ = {
  title: string;
  description?: string;
  imageUrl: string;
  link?: string;
  startDate: string;
  endDate: string;
  order?: number;
};

export type UpdateBannerREQ = Partial<CreateBannerREQ> & {
  isActive?: boolean;
};
