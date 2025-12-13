import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetProductsREQ } from '@/types/product/product.req';
import { ProductDto } from '@/types/product/product.dto';
import { getProductsAPI } from '@/api/product.api';

export const PRODUCTS_QUERY_KEY = 'products';

export const useProductsQuery = (params: GetProductsREQ) => {
  return useQuery<PagingBaseRESP<ProductDto[]>>({
    queryKey: [PRODUCTS_QUERY_KEY, params],
    queryFn: () => getProductsAPI(params),
  });
};
