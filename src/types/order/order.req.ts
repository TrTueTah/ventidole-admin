import { PagingREQ } from '@/types/paging.type';
import { OrderStatus } from './order.dto';

export enum OrderSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TOTAL_AMOUNT = 'totalAmount',
  STATUS = 'status',
}

export type GetOrdersREQ = {
  search?: string;
  sortBy?: OrderSortBy;
  sortOrder?: 'asc' | 'desc';
  status?: OrderStatus;
  userId?: string;
  isActive?: boolean;
} & PagingREQ;

export type UpdateOrderREQ = {
  status?: OrderStatus;
  isActive?: boolean;
};
