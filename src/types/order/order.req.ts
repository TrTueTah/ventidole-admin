import { PagingREQ } from '@/types/paging.type';
import { OrderStatus } from './order.dto';

export enum OrderSortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TOTAL_AMOUNT = 'totalAmount',
  PAID_AT = 'paidAt',
}

export enum PaymentTransactionStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CREDIT = 'CREDIT',
  COD = 'COD',
}

export type GetOrdersREQ = {
  search?: string;
  userId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentTransactionStatus;
  paymentMethod?: PaymentMethod;
  isActive?: string;
  sortBy?: OrderSortBy;
  sortOrder?: 'asc' | 'desc';
} & PagingREQ;

export type UpdateOrderREQ = {
  status?: OrderStatus;
  isActive?: boolean;
};
