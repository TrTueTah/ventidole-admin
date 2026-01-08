export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  PAID = 'PAID',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
}

export type OrderUserDto = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
};

export type OrderItemDto = {
  id: string;
  productId: string;
  productName: string;
  variantId?: string | null;
  variantName?: string | null;
  price: number;
  quantity: number;
};

export type OrderDto = {
  id: string;
  user: OrderUserDto;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: string;
  paidAt?: string | null;
  itemCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type OrderDetailDto = OrderDto & {
  items?: OrderItemDto[];
};
