export type PostDto = {
  id: string;
  content: string;
  mediaUrls?: string[] | null;
  isActive: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  reportCount?: number;
  authorId: string;
  authorName?: string;
  authorAvatarUrl?: string;
  communityId: string;
  communityName?: string;
  createdAt: string;
  updatedAt: string;
};

export type ReportDto = {
  id: string;
  reason: string;
  reportedBy: string;
  reporterName?: string;
  reporterAvatarUrl?: string;
  createdAt: string;
};

export type ReportedPostDto = PostDto & {
  reports: ReportDto[];
};

export type PostDetailDto = PostDto & {
  author: {
    id: string;
    name: string;
    username?: string;
    avatarUrl?: string;
  };
  community: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  reports: Array<{
    id: string;
    reason?: string | null;
    reportedBy: string;
    reporterName: string;
    createdAt: string;
  }>;
};
