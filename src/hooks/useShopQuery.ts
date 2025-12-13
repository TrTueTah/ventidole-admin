import { useQuery } from '@tanstack/react-query';
import { getShopByIdAPI } from '@/api/shop.api';
import { BaseResponse } from '@/types/response.type';
import { ShopDto } from '@/types/shop/shop.dto';

export const SHOP_QUERY_KEY = 'shop';

export const useShopQuery = (id: string, enabled: boolean = true) => {
  return useQuery<BaseResponse<ShopDto>>({
    queryKey: [SHOP_QUERY_KEY, id],
    queryFn: () => getShopByIdAPI(id),
    enabled: enabled && !!id,
  });
};
