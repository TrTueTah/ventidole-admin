export type BannerDto = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  link?: string | null;
  startDate: string;
  endDate: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BannerDetailDto = BannerDto & {
  version: number;
  isDeleted: boolean;
  deletedAt?: string | null;
  metadata?: any;
};
