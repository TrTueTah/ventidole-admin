import { PagingREQ } from "@/types/paging.type";

export type IdolListREQ = {
  search?: string;
  sortBy?: string;
  direction?: string;
} & PagingREQ;