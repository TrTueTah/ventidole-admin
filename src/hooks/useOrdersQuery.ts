import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetOrdersREQ } from '@/types/order/order.req';
import { OrderDto } from '@/types/order/order.dto';
import { getOrdersAPI } from '@/api/order.api';

export const ORDERS_QUERY_KEY = 'orders';

export const useOrdersQuery = (params: GetOrdersREQ) => {
  return useQuery<PagingBaseRESP<OrderDto[]>>({
    queryKey: [ORDERS_QUERY_KEY, params],
    queryFn: () => getOrdersAPI(params),
  });
};
