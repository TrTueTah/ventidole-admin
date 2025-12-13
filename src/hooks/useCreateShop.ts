import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShopAPI, updateShopAPI } from '@/api/shop.api';
import { CreateShopREQ, UpdateShopREQ } from '@/types/shop/shop.req';
import { SHOPS_QUERY_KEY } from './useShopsQuery';

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShopREQ) => createShopAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY] });
    },
  });
};

export const useUpdateShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShopREQ }) =>
      updateShopAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SHOPS_QUERY_KEY] });
    },
  });
};
