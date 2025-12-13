import { BaseResponse, PagingBaseRESP } from '@/types/response.type';
import { OrderDetailDto, OrderDto } from '@/types/order/order.dto';
import { GetOrdersREQ, UpdateOrderREQ } from '@/types/order/order.req';
import { api } from './api-client';
import { ENDPOINTS } from '@/constants/api.constant';

export const getOrdersAPI = async (
  data: GetOrdersREQ
): Promise<PagingBaseRESP<OrderDto[]>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ORDER.get()}`,
    { params: data }
  );
};

export const getOrderByIdAPI = async (
  id: string
): Promise<BaseResponse<OrderDetailDto>> => {
  return await api.get(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ORDER.get(id)}`
  );
};

export const updateOrderAPI = async (
  id: string,
  data: UpdateOrderREQ
): Promise<BaseResponse<OrderDto>> => {
  return await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}${ENDPOINTS.ORDER.get(id)}`,
    data
  );
};
