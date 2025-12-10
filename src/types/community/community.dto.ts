export type CommunityDto = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  backgroundUrl?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommunityInfoDto = {
  id: string;
  name: string;
  avatarUrl: string;
  backgroundUrl: string;
  description: string;
  totalMembers: number;
};
