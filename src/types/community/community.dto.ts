export type CommunityDto = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  backgroundUrl?: string | null;
  description?: string | null;
  communityType: string;
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
  communityType: string;
  totalMembers: number;
};
