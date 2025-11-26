import { PagingREQ } from "@/types/paging.type";

export type IdolListREQ = {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
} & PagingREQ;

export type CreateIdolREQ = {
  email: string;
  password: string;
  stageName: string;
  groupId: string;
  avatarUrl?: string;
  backgroundUrl?: string;
  bio?: string;
}