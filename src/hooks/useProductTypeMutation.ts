import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProductTypeAPI,
  updateProductTypeAPI,
  deleteProductTypeAPI,
} from '@/api/product-type.api';
import {
  CreateProductTypeREQ,
  UpdateProductTypeREQ,
} from '@/types/product-type/product-type.req';
import { PRODUCT_TYPES_QUERY_KEY } from './useProductTypesQuery';

export const useCreateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductTypeREQ) => createProductTypeAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
    },
  });
};

export const useUpdateProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductTypeREQ }) =>
      updateProductTypeAPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
    },
  });
};

export const useDeleteProductType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductTypeAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCT_TYPES_QUERY_KEY] });
    },
  });
};
