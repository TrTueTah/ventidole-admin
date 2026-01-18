import { PagingREQ } from '@/types/paging.type';

export type GetProductTypesREQ = {
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
} & PagingREQ;

export type CreateProductTypeREQ = {
  name: string;
};

export type UpdateProductTypeREQ = {
  name?: string;
  isActive?: boolean;
};
