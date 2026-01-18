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

// Variant types
export type CreateVariantREQ = {
  name: string;
  price: number;
  stock: number;
};

export type UpdateVariantREQ = {
  id?: string; // If provided, updates existing variant; if omitted, creates new
  name: string;
  price: number;
  stock: number;
  isActive?: boolean;
};

// Inline product type creation
export type CreateProductTypeInlineREQ = {
  name: string;
};

export type CreateProductREQ = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  mediaUrls?: string[];
  shopId: string;
  typeId?: string;
  newType?: CreateProductTypeInlineREQ;
  variants?: CreateVariantREQ[];
};

export type UpdateProductREQ = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  mediaUrls?: string[];
  typeId?: string;
  newType?: CreateProductTypeInlineREQ;
  variants?: UpdateVariantREQ[];
  isActive?: boolean;
};
