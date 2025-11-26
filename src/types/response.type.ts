export type BaseResponse<T> = {
  data: T;
  message?: string;
};

export type PagingBaseRESP<T> = {
  data: T;
  paging: PagingRESP;
};

export type PagingRESP = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
