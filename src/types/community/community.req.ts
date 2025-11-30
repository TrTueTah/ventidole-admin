import { PagingREQ } from "@/types/paging.type";

export type CommunityListREQ = {
  search?: string;
  sortBy?: string;
  sortOrder?: string;
} & PagingREQ;
