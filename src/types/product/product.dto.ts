export type ProductShopDto = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type ProductTypeDto = {
  id: string;
  name: string;
};

export type ProductVariantDto = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductDto = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  mediaUrls?: string[];
  shop: ProductShopDto;
  type?: ProductTypeDto | null;
  variants?: ProductVariantDto[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
