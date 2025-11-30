export type CommunityDto = {
  id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

export type CommunitySummaryDto = {
  id: string;
  name: string;
  logoUrl?: string;
};
