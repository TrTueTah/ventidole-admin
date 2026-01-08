import { PagingREQ } from '@/types/paging.type';

export enum PostSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LIKE_COUNT = 'likeCount',
  COMMENT_COUNT = 'commentCount',
  VIEW_COUNT = 'viewCount',
}

export type GetPostsREQ = {
  search?: string;
  sortBy?: PostSortBy;
  sortOrder?: 'asc' | 'desc';
  isActive?: boolean;
  authorId?: string;
  communityId?: string;
} & PagingREQ;

export type GetReportedPostsREQ = {
  sortBy?: PostSortBy;
  sortOrder?: 'asc' | 'desc';
} & PagingREQ;

export type CreatePostREQ = {
  content: string;
  mediaUrls?: string[];
  communityId: string;
};

export type UpdatePostREQ = {
  content?: string;
  mediaUrls?: string[];
  isActive?: boolean;
};
