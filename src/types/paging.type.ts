export type PagingREQ = { offset: number; size: number };

export const initialPagingState: PagingREQ = {
  offset: 0,
  size: 10,
};
