export type UserSummaryDto = {
  id: string;
  email: string;
  role: string;
  isOnline: boolean;
  isActive: boolean;
  createdAt: Date;
};

export type GroupSummaryDto = {
  id: string;
  groupName: string;
  logoUrl?: string;
};

export type IdolDto = {
  id: string;
  stageName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  groupId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  user: UserSummaryDto;
  group: GroupSummaryDto;
};

export type CreatedIdolDto = {
  id: string;
  stageName: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
  groupId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};