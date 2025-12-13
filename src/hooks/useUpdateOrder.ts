import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderAPI } from '@/api/order.api';
import { UpdateOrderREQ } from '@/types/order/order.req';
import { ORDERS_QUERY_KEY } from './useOrdersQuery';
import { ORDER_QUERY_KEY } from './useOrderQuery';

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderREQ }) =>
      updateOrderAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [ORDER_QUERY_KEY] });
    },
  });
};
