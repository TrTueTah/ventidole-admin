import { useQuery } from '@tanstack/react-query';
import { BaseResponse } from '@/types/response.type';
import { BannerDetailDto } from '@/types/banner/banner.dto';
import { getBannerByIdAPI } from '@/api/banner.api';

export const BANNER_QUERY_KEY = 'banner';

export const useBannerQuery = (id: string, enabled = true) => {
  return useQuery<BaseResponse<BannerDetailDto>>({
    queryKey: [BANNER_QUERY_KEY, id],
    queryFn: () => getBannerByIdAPI(id),
    enabled: enabled && !!id,
  });
};
