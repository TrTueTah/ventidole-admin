import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductAPI, updateProductAPI } from '@/api/product.api';
import {
  CreateProductREQ,
  UpdateProductREQ,
} from '@/types/product/product.req';
import { PRODUCTS_QUERY_KEY } from './useProductsQuery';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductREQ) => createProductAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductREQ }) =>
      updateProductAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] });
    },
  });
};
