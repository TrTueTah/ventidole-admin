export type ShopCommunityDto = {
  id: string;
  name: string;
  avatarUrl?: string | null;
};

export type ShopDto = {
  id: string;
  name: string;
  description?: string | null;
  avatarUrl?: string | null;
  community: ShopCommunityDto;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
