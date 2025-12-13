import { useQuery } from '@tanstack/react-query';
import { getOrderByIdAPI } from '@/api/order.api';
import { BaseResponse } from '@/types/response.type';
import { OrderDetailDto } from '@/types/order/order.dto';

export const ORDER_QUERY_KEY = 'order';

export const useOrderQuery = (id: string, enabled: boolean = true) => {
  return useQuery<BaseResponse<OrderDetailDto>>({
    queryKey: [ORDER_QUERY_KEY, id],
    queryFn: () => getOrderByIdAPI(id),
    enabled: enabled && !!id,
  });
};
