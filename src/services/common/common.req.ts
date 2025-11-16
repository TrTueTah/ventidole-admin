import { PagingREQ } from "@/types/paging.type";

export type ListREQ = {
  search: string;
  size: number;
};

export type FilterREQ = {
  search?: string;
} & PagingREQ;