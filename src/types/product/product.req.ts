import { PagingREQ } from '@/types/paging.type';

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
}

export type GetProductsREQ = {
  search?: string;
  sortBy?: ProductSortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  shopId?: string;
  typeId?: string;
} & PagingREQ;

export type CreateProductREQ = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  mediaUrls?: string[];
  shopId: string;
  typeId?: string;
  isActive?: boolean;
};

export type UpdateProductREQ = Partial<CreateProductREQ>;
