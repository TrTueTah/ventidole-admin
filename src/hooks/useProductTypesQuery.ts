import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetProductTypesREQ } from '@/types/product-type/product-type.req';
import { ProductTypeDto } from '@/types/product-type/product-type.dto';
import { getProductTypesAPI } from '@/api/product-type.api';

export const PRODUCT_TYPES_QUERY_KEY = 'productTypes';

export const useProductTypesQuery = (params: GetProductTypesREQ) => {
  return useQuery<PagingBaseRESP<ProductTypeDto[]>>({
    queryKey: [PRODUCT_TYPES_QUERY_KEY, params],
    queryFn: () => getProductTypesAPI(params),
  });
};
