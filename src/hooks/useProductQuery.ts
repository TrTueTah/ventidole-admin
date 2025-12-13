import { useQuery } from '@tanstack/react-query';
import { getProductByIdAPI } from '@/api/product.api';
import { BaseResponse } from '@/types/response.type';
import { ProductDto } from '@/types/product/product.dto';

export const PRODUCT_QUERY_KEY = 'product';

export const useProductQuery = (id: string, enabled: boolean = true) => {
  return useQuery<BaseResponse<ProductDto>>({
    queryKey: [PRODUCT_QUERY_KEY, id],
    queryFn: () => getProductByIdAPI(id),
    enabled: enabled && !!id,
  });
};
