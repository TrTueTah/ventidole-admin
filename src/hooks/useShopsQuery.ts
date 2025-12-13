import { useQuery } from '@tanstack/react-query';
import { PagingBaseRESP } from '@/types/response.type';
import { GetShopsREQ } from '@/types/shop/shop.req';
import { ShopDto } from '@/types/shop/shop.dto';
import { getShopsAPI } from '@/api/shop.api';

export const SHOPS_QUERY_KEY = 'shops';

export const useShopsQuery = (params: GetShopsREQ) => {
  return useQuery<PagingBaseRESP<ShopDto[]>>({
    queryKey: [SHOPS_QUERY_KEY, params],
    queryFn: () => getShopsAPI(params),
  });
};
