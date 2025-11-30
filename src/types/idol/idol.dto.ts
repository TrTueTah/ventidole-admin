import { CommunityDto } from '../community/community.dto';

export type UserSummaryDto = {
  id: string;
  email: string;
  role: string;
  isOnline: boolean;
  isActive: boolean;
  createdAt: Date;
};

export type IdolDto = {
  id: string;
  stageName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  communityId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  user: UserSummaryDto;
  community: CommunityDto;
};

export type CreatedIdolDto = {
  id: string;
  stageName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  communityId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};
